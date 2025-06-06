// lambdas/loginUser/index.js
const { Pool } = require("pg");
const { verifyPassword } = require("../../utils/hash"); // Assumes utils are two levels up
const { generateToken } = require("../../utils/jwt");  // Assumes utils are two levels up

// Database Pool Configuration
// Ensure Environment Variables are set in Lambda Configuration
let pool; // Define pool variable in the outer scope

function getPool() {
    if (!pool) {
        console.log("Initializing new DB pool for loginUser Lambda...");
        pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            // ssl: { rejectUnauthorized: false } // Development only
            // For Production RDS with SSL:
            // ssl: {
            //   rejectUnauthorized: true,
            //   ca: require('fs').readFileSync(__dirname + '/rds-ca-bundle.pem').toString()
            // }
            // Ensure 'rds-ca-bundle.pem' is in your deployment package if using this.
        });
        pool.on('error', (err) => {
            console.error('PostgreSQL Pool Error in loginUser:', err);
            pool = null; // Attempt to reset on error
        });
    }
    return pool;
}

exports.handler = async (event) => {
  // Standard CORS headers - adjust origin for production
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
  };

  if (event.httpMethod === 'OPTIONS' || (event.requestContext && event.requestContext.http && event.requestContext.http.method === 'OPTIONS')) {
    // Note: Corrected event.request_context.http to event.requestContext.http
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body || '{}');
  } catch (parseError) {
    console.error("Invalid JSON input for loginUser:", event.body, parseError);
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON input."}) };
  }

  const { email, password } = requestBody;

  if (!email || !password) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing email or password." }) };
  }

  const currentPool = getPool();

  try {
    const client = await currentPool.connect();
    try {
      const lowercasedEmail = email.toLowerCase();
      // Ensure you select the 'id' column that matches your users table schema (user_id or id)
      // The user's schema for 'users' table specified 'id' as PRIMARY KEY.
      const res = await client.query(`SELECT id, name, email, password FROM users WHERE email = $1`, [lowercasedEmail]);

      if (res.rowCount === 0) {
        console.log(`Login attempt failed: User not found for email ${lowercasedEmail}`);
        return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Invalid credentials." }) };
      }

      const user = res.rows[0];
      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        console.log(`Login attempt failed: Invalid password for user ${user.id}`);
        return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Invalid credentials." }) };
      }

      // Password is valid, generate JWT using the user's 'id'
      const token = generateToken(user.id);

      // Optionally, update last_login_at for the user
      // await client.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Login successful.",
          token,
          user: { // Return user information as specified in user's feedback
            id: user.id,
            name: user.name,
            email: user.email
          }
        })
      };
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error during user login:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error. Could not log in user.", details: err.message }) // Be cautious with err.message in prod
    };
  }
};
