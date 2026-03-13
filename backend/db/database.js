const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST || 'localhost',
  user:     process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todo_app',
  waitForConnections: true,
  connectionLimit: 10,
});

const initDB = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'todo_app'}\``);
    await conn.query(`USE \`${process.env.DB_NAME || 'todo_app'}\``);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        completed   BOOLEAN DEFAULT FALSE,
        priority    ENUM('low', 'medium', 'high') DEFAULT 'medium',
        position    INT DEFAULT 0,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    conn.release();
    console.log('✅ Base de données initialisée');
  } catch (err) {
    console.error('❌ Erreur DB:', err.message);
    process.exit(1);
  }
};

module.exports = { pool, initDB };
