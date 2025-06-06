// lambdas/getMatches/index.js
const { Pool } = require("pg");
const { verifyToken } = require("../../utils/jwt"); // Assumes utils are two levels up

// Database Pool Configuration
let pool;

function getPool() {
    if (!pool) {
        console.log("Initializing new DB pool for getMatches Lambda...");
        pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            // ssl: { rejectUnauthorized: false } // Development only
        });
        pool.on('error', (err) => {
            console.error('PostgreSQL Pool Error in getMatches:', err);
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
      // FROM likes l1
      // JOIN likes l2 ON l1.liker_id = l2.liked_id AND l1.liked_id = l2.liker_id
      // JOIN users u ON u.id = l1.liked_id
      // LEFT JOIN profiles p ON p.user_id = u.id
      // WHERE l1.liker_id = $1
      // Using from_user and to_user as per our 'likes' table schema.
      // The user's query for matches table was:
      // SELECT u.id, u.name, p.*
      // FROM matches m
      // JOIN users u ON (u.id = m.user_a OR u.id = m.user_b) AND u.id != $1
      // LEFT JOIN profiles p ON p.user_id = u.id
      // WHERE (m.user_a = $1 OR m.user_b = $1)
      // This lambda directly finds mutual likes from the 'likes' table and then joins for profile.
      // The previous likeUser lambda already creates entries in 'matches' table.
      // So, this can query the 'matches' table directly.

      const query = `
        SELECT
          u.id AS matched_user_id,
          u.name AS matched_user_name,
          p.name AS matched_user_profile_name, -- from profiles table
          p.dob AS matched_user_dob,
          p.sex AS matched_user_sex,
          p.photos AS matched_user_photos,
          p.location AS matched_user_location,
          p.bio AS matched_user_bio,
          p.interests AS matched_user_interests,
          m.matched_at
        FROM matches m
        JOIN users u ON (u.id = m.user_a OR u.id = m.user_b) AND u.id != $1
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE (m.user_a = $1 OR m.user_b = $1)
        ORDER BY m.matched_at DESC;
      `;

      const values = [userIdFromToken];
      const res = await client.query(query, values);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(res.rows) // Returns an array of matched user profiles/details
      };

    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error fetching matches:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error. Could not fetch matches.", details: err.message })
    };
  }
};
