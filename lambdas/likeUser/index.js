// lambdas/likeUser/index.js
const { Pool } = require("pg");
const { verifyToken } = require("../../utils/jwt"); // Assumes utils are two levels up

// Database Pool Configuration
let pool;

function getPool() {
    if (!pool) {
        console.log("Initializing new DB pool for likeUser Lambda...");
        pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            // ssl: { rejectUnauthorized: false } // Development only
        });
        pool.on('error', (err) => {
            console.error('PostgreSQL Pool Error in likeUser:', err);
            pool = null; // Attempt to reset on error
        });
    }
    return pool;
}

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
  };

  if (event.httpMethod === 'OPTIONS' || (event.requestContext && event.requestContext.http && event.requestContext.http.method === 'OPTIONS')) {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const token = event.headers.Authorization?.split(" ")[1];

  if (!token) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Unauthorized: Missing token" }) };
  }

  let userIdFromToken; // This will be the 'from_user' or 'liker_id'
  try {
    const decoded = verifyToken(token);
    userIdFromToken = decoded.userId;
  } catch (err) {
    console.error("Invalid token:", err);
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: "Unauthorized: Invalid token" }) };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body || '{}');
  } catch (parseError) {
    console.error("Invalid JSON input for likeUser:", event.body, parseError);
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON input."}) };
  }

  const { likedId } = requestBody; // This is the 'to_user' or 'liked_id'

  if (!likedId) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Missing likedId in request body." }) };
  }

  if (userIdFromToken === likedId) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "User cannot like themselves." }) };
  }

  const currentPool = getPool();

  try {
    const client = await currentPool.connect();
    try {
      // Using INSERT ... ON CONFLICT DO NOTHING based on user's spec for 'likes' table (from_user, to_user unique constraint)
      // The table schema used 'from_user' and 'to_user'.
      const query = `
        INSERT INTO likes (from_user, to_user)
        VALUES ($1, $2)
        ON CONFLICT (from_user, to_user) DO NOTHING;
      `;

      const values = [userIdFromToken, likedId];

      await client.query(query, values);

      // Check if a new like was actually inserted or if it was a conflict
      // const result = await client.query(query, values);
      // if (result.rowCount > 0) {
      //    // Logic if you want to confirm a new like vs an existing one
      // }


      // After liking, check if a mutual like exists to form a match
      const matchCheckQuery = `
        WITH new_like AS (
            SELECT $1::UUID AS u1, $2::UUID AS u2
        )
        SELECT l2.from_user AS user_a, l2.to_user AS user_b
        FROM new_like nl
        JOIN likes l1 ON l1.from_user = nl.u1 AND l1.to_user = nl.u2 -- The like we just (tried to) insert
        JOIN likes l2 ON l2.from_user = nl.u2 AND l2.to_user = nl.u1 -- The reverse like
        WHERE NOT EXISTS ( -- Ensure a match doesn't already exist
            SELECT 1 FROM matches m
            WHERE (m.user_a = nl.u1 AND m.user_b = nl.u2) OR (m.user_a = nl.u2 AND m.user_b = nl.u1)
        );
      `;
      const matchResult = await client.query(matchCheckQuery, values);

      if (matchResult.rowCount > 0) {
        const { user_a, user_b } = matchResult.rows[0]; // These are the two user IDs that form the match
        // Insert into matches table, ensuring user_a < user_b for consistent ordering if using LEAST/GREATEST for unique index
        const user1 = user_a < user_b ? user_a : user_b;
        const user2 = user_a < user_b ? user_b : user_a;

        await client.query(
          `INSERT INTO matches (user_a, user_b, matched_at) VALUES ($1, $2, NOW()) ON CONFLICT (LEAST(user_a, user_b), GREATEST(user_a, user_b)) DO NOTHING`,
          [user1, user2]
        );
        console.log(`Match created between ${user1} and ${user2}`);
        // You might want to return a specific response indicating a match was made.
        // For now, just returning "Liked successfully" and the match happens in the background.
      }

      return {
        statusCode: 200, // Or 201 if you can confirm a new like was created
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Like action processed successfully." }) // Vague message as it could be new like or existing
      };

    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error processing like action:", err);
    // Check for specific DB errors if necessary (e.g., foreign key violation if likedId doesn't exist)
    if (err.code === '23503') { // foreign_key_violation
        return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: "User to be liked not found."}) };
    }
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error. Could not process like.", details: err.message })
    };
  }
};
