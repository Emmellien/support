const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET: Fetch all services (Used for the dropdowns in ServiceRecord)
router.get('/services', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Services');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Add a new service (Task: Insert operation on all 4 forms)
router.post('/services', async (req, res) => {
    const { ServiceName, ServicePrice } = req.body;
    try {
        const sql = `INSERT INTO Services (ServiceName, ServicePrice) VALUES (?, ?)`;
        await db.query(sql, [ServiceName, ServicePrice]);
        res.status(201).json({ message: "Service added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;