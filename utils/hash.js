// Shared utility for password hashing and verification using bcryptjs
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10; // Standard cost factor for bcrypt

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} The hashed password.
 */
async function hashPassword(password) {
  if (!password) {
    throw new Error("Password cannot be empty.");
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Verifies a plain text password against a hashed password.
 * @param {string} password - The plain text password to verify.
 * @param {string} hashedPassword - The stored hashed password.
 * @returns {Promise<boolean>} True if the password matches, false otherwise.
 */
async function verifyPassword(password, hashedPassword) {
  if (!password || !hashedPassword) {
    return false; // Or throw an error if preferred
  }
  return bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, verifyPassword };
