// lambdas/getUserProfile/index.js
const { Pool } = require("pg");
const { verifyToken } = require("../../utils/jwt"); // Assumes utils are two levels up

// Database Pool Configuration
let pool;

function getPool() {
    if (!pool) {
        console.log("Initializing new DB pool for getUserProfile Lambda...");
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
        });
        pool.on('error', (err) => {
            console.error('PostgreSQL Pool Error in getUserProfile:', err);
            pool = null; // Attempt to reset on error
        });
    }
    return pool;
}

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,GET' // Typically GET for fetching a profile
  };

  if (event.httpMethod === 'OPTIONS' || (event.requestContext && event.requestContext.http && event.requestContext.http.method === 'OPTIONS')) {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const token = event.headers.Authorization?.split(" ")[1];

  if (!token) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Unauthorized: Missing token" }) };
  }

  let userIdFromToken;
  try {
    const decoded = verifyToken(token); // Uses the shared utility
    userIdFromToken = decoded.userId;
  } catch (err) {
    console.error("Invalid token:", err);
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Unauthorized: Invalid token" }) };
  }

  // The user's spec implies the Lambda fetches the profile of the *authenticated* user.
  // If you wanted to fetch any profile by an ID in the path (e.g., /profiles/{id}),
  // you would get that path parameter here, but the current logic uses the token's userId.

  const currentPool = getPool();

  try {
    const client = await currentPool.connect();
    try {
      // Query based on user's spec: JOIN users and profiles table
      // The user's spec for profiles table includes 'name', 'dob', 'sex', etc.
      // The users table has 'id', 'name', 'email'.
      // The SQL from user spec:
      // SELECT u.id, u.name, u.email, p.*
      // FROM users u
      // LEFT JOIN profiles p ON u.id = p.user_id
      // WHERE u.id = $1
      // We need to ensure column names don't clash or are aliased if necessary.
      // If p.* includes a 'name' column, it might override u.name or vice-versa depending on order.
      // It's safer to list all columns explicitly.

      const query = `
        SELECT
          u.id AS user_id,
          u.email,
          p.name AS profile_name, -- Assuming 'name' in profiles is the primary display name for profile
          p.dob,
          p.sex,
          p.height,
          p.weight,
          p.civil_status,
          p.interests,
          p.lifestyle,
          p.religion,
          p.location,
          p.bio,
          p.photos,
          p.created_at AS profile_created_at,
          p.updated_at AS profile_updated_at
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE u.id = $1
      `;

      const res = await client.query(query, [userIdFromToken]);

      if (res.rowCount === 0) {
        // This case should ideally not happen if a user exists (from token) but has no profile.
        // A LEFT JOIN will still return the user row with NULLs for profile fields.
        // If user record itself is missing (token valid but user deleted?), that's an issue.
        // For now, assume user exists if token is valid.
        // If profile might not exist yet, the client should handle potentially null profile fields.
        return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: "Profile not found for the user." }) };
      }

      // If a user exists but has no entry in profiles table yet, LEFT JOIN returns user details and NULL for profile fields.
      // The application should handle this scenario gracefully (e.g., prompt user to create profile).
      const userProfile = res.rows[0];

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
      };

    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error. Could not fetch profile.", details: err.message })
    };
  }
};
