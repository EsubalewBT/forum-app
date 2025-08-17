const jwt = require("jsonwebtoken");
const tokenModel = require("../Model/token.model");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
// helper to compute expiry epoch seconds
const computeExpiry = (secondsFromNow) =>
  Math.floor(Date.now() / 1000) + secondsFromNow;

// Generate Access Token (15 minutes)
const generateAccessToken = (userId) => {
  const expiresInSeconds = 15 * 60; // 15m
  const token = jwt.sign({ sub: userId }, config.JWT_SECRET, {
    expiresIn: expiresInSeconds,
  });
  return { token, expiresAt: computeExpiry(expiresInSeconds) };
};

// Generate & persist Refresh Token (7 days) and return metadata
const generateRefreshToken = async (userId) => {
  const expiresInSeconds = 7 * 24 * 60 * 60; // 7d
  const token = jwt.sign({ sub: userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: expiresInSeconds,
  });
  const expires = new Date(Date.now() + expiresInSeconds * 1000);
  const hashed = await bcrypt.hash(token, 10);
  await tokenModel.saveToken(userId, hashed, expires);
  return { token, expiresAt: computeExpiry(expiresInSeconds) };
};

// Rotate refresh token: validate existing, delete, issue new
const rotateRefreshToken = async (oldToken) => {
  // We need to scan tokens table and compare (inefficient without an index / redesign)
  // For simplicity, fetch all tokens for the user after decoding first outside.
  // Here we assume caller already validated and has stored row with user_id.
  // So we just generate new and will delete matching hash.
  return null; // placeholder (not used directly after refactor below)
};

// Verify token
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  verifyToken,
};
