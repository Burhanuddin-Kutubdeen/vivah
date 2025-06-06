// lambdas/registerUser/index.js
// Using CommonJS require for this file as per user's original Lambda structure
const { Pool } = require("pg"); // Direct pg usage as per user's original lambda
const { hashPassword } = require("../../utils/hash"); // Adjusted path

// Database Pool Configuration (direct, as in user's example)
// Ensure Environment Variables are set in Lambda Configuration
let pool; // Define pool variable in the outer scope

function getPool() {
    if (!pool) {
        console.log("Initializing new DB pool for registerUser Lambda...");
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
            console.error('PostgreSQL Pool Error in registerUser:', err);
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
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body || '{}');
  } catch (parseError) {
    console.error("Invalid JSON input:", event.body, parseError);
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON input."}) };
  }

  const { name, email, password } = requestBody;

  // Basic input validation
  if (!email || !password || !name) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing required fields: name, email, and password." }) };
  }

  // Consider more robust email validation here
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  if (!emailRegex.test(email)) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid email format." }) };
  }
  // Consider password strength validation here

  const currentPool = getPool(); // Get the pool instance

  try {
    const client = await currentPool.connect();
    try {
      const lowercasedEmail = email.toLowerCase();
      const hashedPassword = await hashPassword(password);

      // The user's table schema uses 'id' as primary key.
      const result = await client.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
        [name, lowercasedEmail, hashedPassword]
      );

      const newUser = result.rows[0];

      // Optional: Create a corresponding entry in 'profiles' table
      // await client.query('INSERT INTO profiles (user_id, /* other default fields */) VALUES ($1, /* ... */)', [newUser.id]);

      return {
        statusCode: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "User registered successfully.",
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            created_at: newUser.created_at
          }
        })
      };
    } finally {
      client.release(); // Ensure client is always released
    }
  } catch (err) {
    console.error("Error during user registration:", err);
    if (err.code === '23505') { // PostgreSQL unique_violation error code
      // Specific error for email already registered
      return {
        statusCode: 409, // Conflict
        headers: corsHeaders,
        body: JSON.stringify({ error: "Email address is already registered." })
      };
    }
    // Generic server error
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error. Could not register user.", details: err.message }) // Be cautious with err.message in prod
    };
  }
};
