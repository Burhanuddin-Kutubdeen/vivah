// lambdas/updateUserProfile/index.js
const { Pool } = require("pg");
const { verifyToken } = require("../../utils/jwt"); // Assumes utils are two levels up

// Database Pool Configuration
let pool;

function getPool() {
    if (!pool) {
        console.log("Initializing new DB pool for updateUserProfile Lambda...");
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
            console.error('PostgreSQL Pool Error in updateUserProfile:', err);
            pool = null; // Attempt to reset on error
        });
    }
    return pool;
}

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,PUT' // Typically PUT for updating a profile
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

  let requestBody;
  try {
    requestBody = JSON.parse(event.body || '{}');
  } catch (parseError) {
    console.error("Invalid JSON input for updateUserProfile:", event.body, parseError);
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON input."}) };
  }

  // Destructure all expected profile fields from the user's spec for profiles table
  const {
    name, // Assuming name is part of the profile to update
    dob,
    sex,
    height,
    weight,
    civil_status,
    interests,
    lifestyle,
    religion,
    location,
    bio,
    photos
  } = requestBody;

  // Basic validation: Check if at least some profile data is provided.
  // More specific validation (e.g., for date formats, array types, specific values for sex/civil_status) should be added.
  if (Object.keys(requestBody).length === 0) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "No profile data provided." }) };
  }
  // Example: Validate 'dob' if provided
  // if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
  //   return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid date of birth format. Use YYYY-MM-DD." }) };
  // }
  // Ensure arrays are actually arrays if provided
  // if (interests && !Array.isArray(interests)) return { statusCode: 400, body: JSON.stringify({ error: "Interests must be an array."}) };
  // if (photos && !Array.isArray(photos)) return { statusCode: 400, body: JSON.stringify({ error: "Photos must be an array."}) };
  // if (lifestyle && !Array.isArray(lifestyle)) return { statusCode: 400, body: JSON.stringify({ error: "Lifestyle must be an array."}) };


  const currentPool = getPool();

  try {
    const client = await currentPool.connect();
    try {
      // Using INSERT ... ON CONFLICT DO UPDATE (upsert)
      // Assumes 'user_id' is the PRIMARY KEY in 'profiles' table.
      // The 'updated_at' field in profiles table should be handled by a DB trigger or set here.
      const query = `
        INSERT INTO profiles (
          user_id, name, dob, sex, height, weight, civil_status,
          interests, lifestyle, religion, location, bio, photos, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          name = EXCLUDED.name,
          dob = EXCLUDED.dob,
          sex = EXCLUDED.sex,
          height = EXCLUDED.height,
          weight = EXCLUDED.weight,
          civil_status = EXCLUDED.civil_status,
          interests = EXCLUDED.interests,
          lifestyle = EXCLUDED.lifestyle,
          religion = EXCLUDED.religion,
          location = EXCLUDED.location,
          bio = EXCLUDED.bio,
          photos = EXCLUDED.photos,
          updated_at = NOW()
        RETURNING *; -- Optionally return the updated/inserted profile
      `;

      const values = [
        userIdFromToken, name, dob, sex, height, weight, civil_status,
        interests, lifestyle, religion, location, bio, photos
      ];

      const res = await client.query(query, values);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Profile updated successfully.", profile: res.rows[0] })
      };

    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error updating user profile:", err);
    // Check for specific DB errors if necessary (e.g., foreign key violation if user_id doesn't exist in users, though JWT check should prevent this)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error. Could not update profile.", details: err.message })
    };
  }
};
