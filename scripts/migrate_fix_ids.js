// One-off migration to normalize questions & answers tables to integer auto-increment IDs
// Run with: node scripts/migrate_fix_ids.js

require('dotenv').config();
const db = require('../config/db');

(async () => {
  const steps = [];
  const exec = async (sql) => {
    steps.push(sql);
    try {
      await db.query(sql);
      console.log('[OK]', sql.split('\n')[0]);
    } catch (e) {
      console.error('[FAIL]', sql, '\n =>', e.message);
      throw e; // stop on first failure
    }
  };

  try {
    console.log('Starting migration: normalize IDs for questions & answers');

    // 1. Drop FK in answers referencing questions.questionid if exists
    // Need to discover actual constraint name first
    const [fkRows] = await db.query("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='answers' AND REFERENCED_TABLE_NAME='questions'");
    for (const r of fkRows) {
      await exec(`ALTER TABLE answers DROP FOREIGN KEY \`${r.CONSTRAINT_NAME}\``);
    }

    // 2. Remove legacy column questionid from questions (drop unique index first if still exists)
    // Check if column exists
    const [qCols] = await db.query("SHOW COLUMNS FROM questions LIKE 'questionid'");
    if (qCols.length) {
      // Drop index if any
      const [idx] = await db.query("SHOW INDEX FROM questions WHERE Column_name='questionid'");
      for (const i of idx) {
        if (i.Key_name === 'questionid') {
          await exec('ALTER TABLE questions DROP INDEX `questionid`');
        }
      }
      await exec('ALTER TABLE questions DROP COLUMN `questionid`');
    } else {
      console.log('questions.questionid already removed');
    }

    // 3. Alter answers: if answerid exists convert to int id; else ensure id exists
    const [aCols] = await db.query('SHOW COLUMNS FROM answers');
    const hasAnswerId = aCols.some(c => c.Field === 'answerid');
    const hasId = aCols.some(c => c.Field === 'id');

    if (hasAnswerId) {
      // Add new int id first if not exists
      const [checkIdAfter] = await db.query('SHOW COLUMNS FROM answers LIKE "id"');
      if (!checkIdAfter.length) {
        await exec('ALTER TABLE answers ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST');
      } else {
        // ensure it's primary key
        const [pkInfo] = await db.query("SHOW INDEX FROM answers WHERE Key_name='PRIMARY'");
        if (!pkInfo.length) {
          await exec('ALTER TABLE answers ADD PRIMARY KEY (`id`)');
        }
      }
      // Now drop old answerid indexes and column
      const [aIdx] = await db.query("SHOW INDEX FROM answers WHERE Column_name='answerid'");
      for (const i of aIdx) {
        if (i.Key_name === 'answerid') {
          await exec('ALTER TABLE answers DROP INDEX `answerid`');
        }
      }
      // Drop answerid column
      await exec('ALTER TABLE answers DROP COLUMN `answerid`');
    } else if (!hasId) {
      await exec('ALTER TABLE answers ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST');
    } else {
      console.log('answers.id already exists');
    }

    // 4. Ensure answers.questionid is INT NOT NULL referencing questions.id
    const [aQcol] = await db.query("SHOW COLUMNS FROM answers LIKE 'questionid'");
    if (aQcol.length) {
      const col = aQcol[0];
      if (!/int/i.test(col.Type)) {
        await exec('ALTER TABLE answers MODIFY COLUMN `questionid` INT NOT NULL');
      }
    } else {
      // If absent, maybe named question_id; rename for consistency with code expects questionid
      const [aQcol2] = await db.query("SHOW COLUMNS FROM answers LIKE 'question_id'");
      if (aQcol2.length) {
        await exec('ALTER TABLE answers CHANGE COLUMN `question_id` `questionid` INT NOT NULL');
      } else {
        console.log('No questionid column found in answers (unexpected)');
      }
    }

    // 5. Recreate foreign keys
    await exec('ALTER TABLE answers ADD CONSTRAINT `answers_question_fk` FOREIGN KEY (`questionid`) REFERENCES `questions`(`id`) ON DELETE CASCADE');

    // 6. (Optional) Add timestamps if missing in answers
    const timestampCols = aCols.map(c => c.Field);
    if (!timestampCols.includes('created_at')) {
      await exec('ALTER TABLE answers ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    }
    if (!timestampCols.includes('updated_at')) {
      await exec('ALTER TABLE answers ADD COLUMN `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    }

    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
})();
