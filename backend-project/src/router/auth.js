const router = require('express').Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPwd = await bcrypt.hash(password, 12);
    try {
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPwd]);
        res.status(201).json({ message: "User created" });
    } catch (err) { res.status(500).json(err); }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (user.length > 0 && await bcrypt.compare(password, user[0].password)) {
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: user[0].username, userId: user[0].id });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports = router;