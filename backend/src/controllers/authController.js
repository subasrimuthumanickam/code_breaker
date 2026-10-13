const pool = require("../db");

// POST /api/login
// Body: { username: string }
// Finds an existing user by username, or creates a new one.
// Always returns JSON: { id, username, createdAt }
exports.login = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length < 2
    ) {
      return res
        .status(400)
        .json({ error: "username must be at least 2 characters" });
    }

    const trimmed = username.trim();

    const [existingRows] = await pool.query(
      "SELECT id, username, created_at FROM users WHERE username = ? LIMIT 1",
      [trimmed]
    );

    let user;

    if (existingRows.length > 0) {
      user = existingRows[0];
      await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = ?", [
        user.id,
      ]);
    } else {
      const [result] = await pool.query(
        "INSERT INTO users (username, last_login_at) VALUES (?, NOW())",
        [trimmed]
      );
      user = {
        id: result.insertId,
        username: trimmed,
        created_at: new Date(),
      };
    }

    res.json({
      id: user.id,
      username: user.username,
      createdAt: user.created_at,
    });
  } catch (err) {
    next(err);
  }
};