const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

/**
 * 1. GET: Paginated Reports
 * Fetches records 5 at a time for the frontend table.
 */
router.get('/reports', verifyToken, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
        // Query to get the data
        const sql = `
            SELECT 
                sr.RecordNumber, 
                sr.ServiceDate, 
                sr.PlateNumber, 
                s.ServiceName, 
                s.ServiceCode,
                p.AmountPaid,
                sr.Notes
            FROM servicerecord sr
            JOIN services s ON sr.ServiceCode = s.ServiceCode
            JOIN payment p ON sr.RecordNumber = p.RecordNumber
            ORDER BY sr.ServiceDate DESC
            LIMIT ? OFFSET ?`;
        
        const [rows] = await db.query(sql, [limit, offset]);

        // Query to get the total count for pagination math
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM servicerecord');
        
        res.json({ 
            data: rows, 
            totalPages: Math.ceil(total / limit),
            currentPage: page 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * 2. POST: Insert ServiceRecord & Payment
 * Handles the initial checkout of a vehicle.
 */
router.post('/checkout', verifyToken, async (req, res) => {
    const { PlateNumber, ServiceCode, AmountPaid, Notes } = req.body;
    const userId = req.user ? req.user.id : null; 

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Insert into servicerecord
        const [recordResult] = await conn.execute(
            'INSERT INTO servicerecord (PlateNumber, ServiceCode, Notes) VALUES (?, ?, ?)', 
            [PlateNumber, parseInt(ServiceCode), Notes || '']
        );
        
        const newRecordNumber = recordResult.insertId;

        // Insert into payment
        await conn.execute(
            'INSERT INTO payment (RecordNumber, AmountPaid, ReceivedBy) VALUES (?, ?, ?)',
            [newRecordNumber, parseFloat(AmountPaid), userId]
        );

        await conn.commit();
        res.status(201).json({ success: true, message: "Checkout successful!" });
    } catch (err) {
        if (conn) await conn.rollback();
        res.status(500).json({ error: "Database failure", details: err.message });
    } finally {
        if (conn) conn.release();
    }
});

/**
 * 3. PUT: Update Record
 * Specifically for the Edit button in your frontend.
 */
router.put('/:id', verifyToken, async (req, res) => {
    const { ServiceCode, Notes, AmountPaid } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Update the service info
        await conn.execute(
            'UPDATE servicerecord SET ServiceCode = ?, Notes = ? WHERE RecordNumber = ?',
            [parseInt(ServiceCode), Notes || '', req.params.id]
        );

        // Update the payment info if AmountPaid is provided
        if (AmountPaid) {
            await conn.execute(
                'UPDATE payment SET AmountPaid = ? WHERE RecordNumber = ?',
                [parseFloat(AmountPaid), req.params.id]
            );
        }

        await conn.commit();
        res.json({ success: true, message: "Record and Payment updated" });
    } catch (err) {
        if (conn) await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

/**
 * 4. GET: Single Bill Data
 * Used for the "Print Bill" popup.
 */
router.get('/bill/:id', verifyToken, async (req, res) => {
    try {
        const sql = `
            SELECT 
                sr.RecordNumber, 
                sr.ServiceDate, 
                c.Model, 
                sr.PlateNumber, 
                s.ServiceName, 
                p.AmountPaid, 
                u.username as Cashier
            FROM servicerecord sr
            JOIN car c ON sr.PlateNumber = c.PlateNumber
            JOIN services s ON sr.ServiceCode = s.ServiceCode
            JOIN payment p ON sr.RecordNumber = p.RecordNumber
            JOIN users u ON p.ReceivedBy = u.id
            WHERE sr.RecordNumber = ?`;
        const [rows] = await db.query(sql, [req.params.id]);
        
        if (rows.length === 0) return res.status(404).json({ error: "Bill not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 5. DELETE: Remove Record
 */
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Delete payment first to avoid FK constraint errors
        await db.query('DELETE FROM payment WHERE RecordNumber = ?', [req.params.id]);
        await db.query('DELETE FROM servicerecord WHERE RecordNumber = ?', [req.params.id]);
        res.json({ success: true, message: "Record deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 6. GET: Car List
 */
router.get('/cars/list', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT PlateNumber, Model FROM car');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch cars" });
    }
});

module.exports = router;