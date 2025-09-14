const db = require("../config/db");
const logger = require("../config/logger");
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL
);
`;
const createQuestionsTable = `
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tag VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);
`;
const createAnswersTable = `
CREATE TABLE IF NOT EXISTS answers (
   id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    questionid INT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (questionid) REFERENCES questions(id) ON DELETE CASCADE
);
`;
const createTokenTable = `
CREATE TABLE IF NOT EXISTS tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token TEXT NOT NULL,
  expires DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE
)`;

const createtable = async () => {
  try {
    await db.query(createUserTable);
    logger.info(" Users table created");

    await db.query(createQuestionsTable);
    logger.info(" Questions table created");

    await db.query(createAnswersTable);
    logger.info(" Answers table created");
    await db.query(createTokenTable);
    logger.info(" Tokens table created");
  } catch (error) {
    logger.error(" Error creating tables:", error.message);
  }
};

module.exports = {
  createtable,
};
