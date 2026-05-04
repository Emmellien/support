const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import your simple db connection

// GET all cars: http://localhost:5000/api/cars
router.get('/cars', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM car');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new car: http://localhost:5000/api/cars
router.post('/cars', async (req, res) => {
    const { PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;
    try {
        const sql = `INSERT INTO car (PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName]);
        res.status(201).json({ message: "Car added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a car: http://localhost:5000/api/cars/RAG
router.delete('/cars/:plate', async (req, res) => {
    try {
        await db.query('DELETE FROM car WHERE PlateNumber = ?', [req.params.plate]);
        res.json({ message: "Car deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;