const db = require("../config/db");
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
    questionid VARCHAR(255) NOT NULL UNIQUE,
    userid INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tag VARCHAR(255),
    FOREIGN KEY (userid) REFERENCES users(userid)
);
`;
const createAnswersTable = `
CREATE TABLE IF NOT EXISTS answers (
    answerid VARCHAR(255) NOT NULL UNIQUE,
    userid INT NOT NULL,
    questionid VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    PRIMARY KEY (answerid),
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (questionid) REFERENCES questions(questionid)
);
`;

const createtable = async () => {
  try {
    await db.query(createUserTable);
    console.log(" Users table created");

    await db.query(createQuestionsTable);
    console.log(" Questions table created");

    await db.query(createAnswersTable);
    console.log(" Answers table created");
    console.log(" All tables created successfully!");
  } catch (error) {
    console.error(" Error creating tables:", error.message);
  }
};

module.exports = {
  createtable,
};
