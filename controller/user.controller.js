const { registerUser, loginUser } = require("../service/user.service");
const tokenService = require("../service/token.service");
const tokenModel = require("../Model/token.model");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  const { user, tokens } = await registerUser(req.body);
  res
    .status(201)
    .json({ message: "User registered successfully", user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await loginUser(email, password);
  res
    .status(200)
    .json({ message: "User logged in successfully", user, tokens });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: incoming } = req.body;
  if (!incoming) throw new ApiError(400, "Refresh token is required");
  const decoded = tokenService.verifyToken(
    incoming,
    process.env.JWT_REFRESH_SECRET
  );
  const db = require("../config/db");
  const bcrypt = require("bcryptjs");
  const [rows] = await db.query("SELECT * FROM tokens WHERE user_id = ?", [
    decoded.sub,
  ]);
  const matchRow = rows.find((r) => bcrypt.compareSync(incoming, r.token));
  if (!matchRow) throw new ApiError(401, "Invalid refresh token");
  // delete old hash
  await tokenModel.deleteToken(matchRow.token);
  const newRefresh = await tokenService.generateRefreshToken(decoded.sub);
  const newAccess = tokenService.generateAccessToken(decoded.sub);
  res.json({ tokens: { access: newAccess, refresh: newRefresh } });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken: incoming } = req.body;
  if (incoming) {
    try {
      const decoded = tokenService.verifyToken(
        incoming,
        process.env.JWT_REFRESH_SECRET
      );
      const db = require("../config/db");
      const bcrypt = require("bcryptjs");
      const [rows] = await db.query("SELECT * FROM tokens WHERE user_id = ?", [
        decoded.sub,
      ]);
      const matchRow = rows.find((r) => bcrypt.compareSync(incoming, r.token));
      if (matchRow) await tokenModel.deleteToken(matchRow.token);
    } catch (_) {
      // ignore token errors on logout
    }
  }
  res.status(204).send();
});

module.exports = { register, login, refreshToken, logout };
