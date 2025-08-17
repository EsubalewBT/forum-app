const cron = require("node-cron");
const db = require("../config/db");

// Runs every hour to delete expired refresh tokens
cron.schedule("0 * * * *", async () => {
  try {
    await db.query("DELETE FROM tokens WHERE expires < NOW()");
    // Optional: console.log('Expired tokens pruned');
  } catch (e) {
    console.error("Failed to prune tokens", e.message);
  }
});

module.exports = {}; // just to ensure file can be required
