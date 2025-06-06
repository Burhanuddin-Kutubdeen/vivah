// lambdas/registerUser/db.mjs
import pg from 'pg';

const { Pool } = pg;
let pool;

// Database connection configuration
// These should be set as environment variables in your Lambda configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER, // For local dev; consider IAM for Lambda execution in production
  password: process.env.DB_PASSWORD, // For local dev; consider IAM for Lambda execution in production
  // SSL configuration - IMPORTANT for production
  // ssl: {
  //   rejectUnauthorized: true,
  //   // ca: fs.readFileSync(__dirname + '/rds-combined-ca-bundle.pem').toString(), // Requires 'fs' and the CA bundle file
  // }
};

// Initialize the pool (this will run once per Lambda container initialization)
// if (!pool) {
//   console.log('Initializing new DB pool for registerUser...');
//   pool = new Pool(dbConfig);

//   pool.on('error', (err, client) => {
//     console.error('Unexpected error on idle PostgreSQL client', err);
//     // Depending on the error, you might want to exit or re-initialize the pool
//     // For now, just logging. In a real app, more robust handling might be needed.
//   });
// }

// export const getDbPool = () => {
//   if (!pool) {
//     // This case should ideally not be hit if pool is initialized above.
//     // If it is, it means the outer initialization didn't stick or this is a very cold start.
//     console.warn('Re-initializing DB pool inside getDbPool. This might indicate an issue or a very cold start.');
//     pool = new Pool(dbConfig);
//     pool.on('error', (err) => console.error('Unexpected error on idle PostgreSQL client (re-init)', err));
//   }
//   return pool;
// };


// Simpler approach for now, create pool on demand if not exists.
// For production, more sophisticated cold start management might be needed.
export function getDbPool() {
    if (!pool) {
        console.log('Initializing new DB pool for registerUser...');
        pool = new Pool(dbConfig);
        pool.on('error', (err) => {
            console.error('PostgreSQL Pool Error in registerUser:', err);
            // Potentially reset pool or handle specific errors
            pool = null; // Force re-init on next call if pool is bad
        });
    }
    return pool;
}

// Note: The original user code directly created `new Pool()` in each Lambda.
// This shared `db.mjs` is an attempt to centralize pool logic slightly,
// but each Lambda will still manage its own pool instance as per Node.js module caching per Lambda container.
// For true cross-invocation sharing within the same container, the pool must be initialized outside the handler.
// The above structure with `let pool;` and `if (!pool)` aims for that.
