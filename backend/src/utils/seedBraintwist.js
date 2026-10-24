

const db = require('../db');
const levels = require('./braintwistLevels');

(async () => {
  try {
    for (const l of levels) {
      await db.query(
        `INSERT INTO bt_levels (n, type, question, config, answer)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           type = VALUES(type),
           question = VALUES(question),
           config = VALUES(config),
           answer = VALUES(answer)`,
        [l.n, l.type, l.q, JSON.stringify(l.cfg), JSON.stringify(l.a)]
      );
    }

    // remove old levels that are not in braintwistLevels.js (example: an old level 8)
    try {
      const [del] = await db.query('DELETE FROM bt_levels WHERE n > ?', [
        levels.length,
      ]);
      if (del.affectedRows) {
        console.log('Removed', del.affectedRows, 'old extra level(s)');
      }
    } catch (err) {
      console.warn('Could not remove extra levels:', err.message);
    }

    const [rows] = await db.query(
      'SELECT n, type, question FROM bt_levels ORDER BY n'
    );

    console.log('bt_levels now has', rows.length, 'levels:');
    console.table(rows);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
})();
