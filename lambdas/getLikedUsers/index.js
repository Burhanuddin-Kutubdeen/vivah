// lambdas/getLikedUsers/index.js
const { Pool } = require("pg");
const { verifyToken } = require("../../utils/jwt"); // Assumes utils are two levels up

// Database Pool Configuration
let pool;

function getPool() {
    if (!pool) {
        console.log("Initializing new DB pool for getLikedUsers Lambda...");
        pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            // ssl: { rejectUnauthorized: false } // Development only
        });
        pool.on('error', (err) => {
            console.error('PostgreSQL Pool Error in getLikedUsers:', err);
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
      // SELECT u.id, u.name, p.gender, p.location
      // FROM likes l
      // JOIN users u ON l.liked_id = u.id  (Note: user spec had l.liked_id, but table schema was to_user)
      // LEFT JOIN profiles p ON p.user_id = u.id
      // WHERE l.liker_id = $1 (Note: user spec had l.liker_id, but table schema was from_user)
      // I will use from_user and to_user as per our SQL schema for 'likes' table.

      const query = `
        SELECT
          u.id AS liked_user_id,
          u.name AS liked_user_name,
          p.gender AS liked_user_gender,
          p.location AS liked_user_location,
          p.photos AS liked_user_photos -- Added photos as it's usually important for a liked list
          -- Add other relevant fields from 'users' or 'profiles' table for the liked user
        FROM likes l
        JOIN users u ON l.to_user = u.id
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE l.from_user = $1
        ORDER BY l.created_at DESC; -- Optional: order by when the like was made
      `;

      const values = [userIdFromToken];
      const res = await client.query(query, values);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(res.rows) // Returns an array of liked user profiles/details
      };

    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error fetching liked users:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error. Could not fetch liked users.", details: err.message })
    };
  }
};
