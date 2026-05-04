const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection immediately
db.getConnection()
    .then(conn => {
        console.log("✅ Connected to support Database");
        conn.release();
    })
    .catch(err => {
        console.error("❌ DB Connection Failed: ", err.message);
        console.log("Check if XAMPP MySQL is started and DB 'support' exists.");
    });

module.exports = db;