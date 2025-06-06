// lambdas/getMatchSuggestions/index.js
const { Pool } = require("pg");
const { verifyToken } = require("../../utils/jwt"); // Assumes utils are two levels up

// Database Pool Configuration
let pool;

function getPool() {
    if (!pool) {
        console.log("Initializing new DB pool for getMatchSuggestions Lambda...");
        pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            // ssl: { rejectUnauthorized: false } // Development only
        });
        pool.on('error', (err) => {
            console.error('PostgreSQL Pool Error in getMatchSuggestions:', err);
            pool = null; // Attempt to reset on error
        });
    }
    return pool;
}

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,GET'
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
    const decoded = verifyToken(token);
    userIdFromToken = decoded.userId;
  } catch (err) {
    console.error("Invalid token:", err);
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Unauthorized: Invalid token" }) };
  }

  const currentPool = getPool();

  try {
    const client = await currentPool.connect();
    try {
      // SQL query based on user's spec:
      // SELECT u.id, u.name, p.*
      // FROM match_suggestions ms
      // JOIN users u ON u.id = ms.suggested_id
      // LEFT JOIN profiles p ON p.user_id = u.id
      // WHERE ms.user_id = $1
      // ORDER BY ms.created_at DESC
      // LIMIT 10

      const query = `
        SELECT
          u.id AS suggested_user_id,
          u.name AS suggested_user_name, -- From users table
          p.name AS suggested_user_profile_name, -- From profiles table
          p.dob AS suggested_user_dob,
          p.sex AS suggested_user_sex,
          p.photos AS suggested_user_photos,
          p.location AS suggested_user_location,
          p.bio AS suggested_user_bio,
          p.interests AS suggested_user_interests,
          ms.reason AS suggestion_reason,
          ms.created_at AS suggestion_created_at
        FROM match_suggestions ms
        JOIN users u ON u.id = ms.suggested_id
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE ms.user_id = $1
        ORDER BY ms.created_at DESC
        LIMIT 10; -- As per user's spec
      `;

      const values = [userIdFromToken];
      const res = await client.query(query, values);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(res.rows) // Returns an array of suggested user profiles/details
      };

    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error fetching match suggestions:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error. Could not fetch match suggestions.", details: err.message })
    };
  }
};
