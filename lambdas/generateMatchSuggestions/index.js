// lambdas/generateMatchSuggestions/index.js
const { Pool } = require("pg");

// Database Pool Configuration
let pool;

function getPool() {
    if (!pool) {
        console.log("Initializing new DB pool for generateMatchSuggestions Lambda...");
        pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            // ssl: { rejectUnauthorized: false } // Development only
        });
        pool.on('error', (err) => {
            console.error('PostgreSQL Pool Error in generateMatchSuggestions:', err);
            pool = null; // Attempt to reset on error
        });
    }
    return pool;
}

exports.handler = async (event) // 'event' will contain details if triggered by EventBridge
 => {
  console.log("generateMatchSuggestions Lambda triggered. Event:", JSON.stringify(event, null, 2));

  const currentPool = getPool();
  let client; // Define client outside try so it can be used in finally

  try {
    client = await currentPool.connect();
    console.log("Successfully connected to database.");

    // 1. Get all active users (or a subset you want to generate suggestions for)
    // The user's spec implies fetching all users: `SELECT id, location FROM users`
    // Consider adding an 'is_active' flag or 'last_login_at' to filter users if needed.
    const usersRes = await client.query(`SELECT id, location FROM users WHERE is_active = TRUE;`); // Assuming an is_active flag
    const users = usersRes.rows;
    console.log(`Found ${users.length} active users to process for suggestions.`);

    let suggestionsCreatedCount = 0;

    for (const user of users) {
      const userId = user.id;
      const userLocation = user.location; // User's location for filtering potential suggestions

      // 2. Get IDs of users already liked, matched, or previously suggested to this user
      // User spec query:
      // SELECT liked_id AS id FROM likes WHERE liker_id = $1
      // UNION
      // SELECT liker_id FROM likes WHERE liked_id = $1
      // UNION
      // SELECT suggested_id FROM match_suggestions WHERE user_id = $1
      // Using from_user and to_user for 'likes' table, and user_a/user_b for 'matches'
      const exclusionQuery = `
        SELECT to_user AS id FROM likes WHERE from_user = $1
        UNION
        SELECT from_user AS id FROM likes WHERE to_user = $1
        UNION
        SELECT user_a AS id FROM matches WHERE user_b = $1
        UNION
        SELECT user_b AS id FROM matches WHERE user_a = $1
        UNION
        SELECT suggested_id FROM match_suggestions WHERE user_id = $1;
      `;
      const exclusionRes = await client.query(exclusionQuery, [userId]);
      const excludedIds = exclusionRes.rows.map(row => row.id);
      excludedIds.push(userId); // Ensure user doesn't get suggested to themselves

      // 3. Fetch potential matches (suggestions)
      // User spec query:
      // SELECT u.id, p.*
      // FROM users u
      // JOIN profiles p ON u.id = p.user_id
      // WHERE u.id != $1
      //   AND (p.location = $2 OR p.location IS NULL) --> User location might be NULL, handle this
      //   AND NOT u.id = ANY($3::uuid[])
      // LIMIT 10
      // Enhancements: Add more filtering criteria (e.g., opposite gender if specified, age range, interests)
      let potentialQuery = `
        SELECT u.id, p.location
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE u.is_active = TRUE AND u.id != $1
      `;
      const potentialQueryParams = [userId];
      let paramIndex = 2;

      if (userLocation) {
        potentialQuery += ` AND (p.location = $${paramIndex++} OR p.location IS NULL)`; // Prioritize same location, include those with no location
        potentialQueryParams.push(userLocation);
      }

      potentialQuery += ` AND NOT u.id = ANY($${paramIndex++}::uuid[])`;
      potentialQueryParams.push(excludedIds);

      potentialQuery += ` ORDER BY RANDOM() LIMIT 10;`; // Get random 10 suggestions matching criteria

      const potentialRes = await client.query(potentialQuery, potentialQueryParams);

      // 4. Insert into match_suggestions
      for (const suggestion of potentialRes.rows) {
        await client.query(`
          INSERT INTO match_suggestions (user_id, suggested_id, reason)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, suggested_id) DO NOTHING;
        `, [userId, suggestion.id, 'Location + not liked/matched/suggested']);
        suggestionsCreatedCount++;
      }
      if (potentialRes.rows.length > 0) {
        console.log(`Generated ${potentialRes.rows.length} suggestions for user ${userId}.`);
      }
    }

    console.log(`Match suggestions generation complete. Total suggestions created in this run: ${suggestionsCreatedCount}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Match suggestions generated successfully. Processed ${users.length} users. Created ${suggestionsCreatedCount} new suggestions.` })
    };

  } catch (err) {
    console.error("Error generating match suggestions:", err);
    // For a scheduled job, you might want to ensure it doesn't retry indefinitely on certain errors.
    // CloudWatch Alarms on error metrics would be important.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error during suggestion generation.", details: err.message })
      // Rethrowing error might be appropriate if EventBridge is configured for retries on error
      // throw err;
    };
  } finally {
    if (client) {
      client.release();
      console.log("Database client released.");
    }
  }
};
