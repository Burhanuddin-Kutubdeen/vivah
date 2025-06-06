// Shared utility for JWT generation and verification
const jwt = require("jsonwebtoken");

// IMPORTANT: JWT_SECRET should be set as an environment variable in your Lambda configuration
// For production, consider fetching this from AWS Secrets Manager at Lambda cold start.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Log an error or throw if in a context where immediate failure is better.
  // For Lambdas, they might fail on invocation if JWT_SECRET isn't available.
  console.error("FATAL ERROR: JWT_SECRET environment variable is not set.");
}

/**
 * Generates a JWT for a given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {string} The generated JWT.
 */
function generateToken(userId) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not available to sign the token.");
  }
  // Standard payload includes 'iat' (issued at). 'exp' (expiration time) is set by options.
  // You can add more claims to the payload if needed (e.g., roles, permissions)
  // but keep the token size in mind.
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30m" }); // Expires in 30 minutes
}

/**
 * Verifies a JWT.
 * @param {string} token - The JWT to verify.
 * @returns {object|null} The decoded payload if verification is successful, otherwise throws an error.
 *                        Consider wrapping this in a try-catch in the calling code.
 */
function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not available to verify the token.");
  }
  // jwt.verify will throw an error if the token is invalid (e.g., malformed, expired, signature mismatch)
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
