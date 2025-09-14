const { id } = require("../validation/env.validation");

function cleanUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  // Normalize id (DB may return userid)
  const id = rest.id || rest.userid;
  // Remove duplicate key if present
  if (rest.userid) delete rest.userid;
  return { id, ...rest };
}
module.exports = cleanUser;
