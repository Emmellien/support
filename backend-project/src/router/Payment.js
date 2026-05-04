const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

/**
 * 1. POST: Record a new payment
 * This is used when a car repair is finished.
 */
router.post('/payments', verifyToken, async (req, res) => {
    const { RecordNumber, AmountPaid } = req.body;
    const ReceivedBy = req.user.id; // Taken from the JWT token via middleware

    try {
        const sql = `INSERT INTO Payment (RecordNumber, AmountPaid, ReceivedBy) VALUES (?, ?, ?)`;
        await db.query(sql, [RecordNumber, AmountPaid, ReceivedBy]);
        
        res.status(201).json({ 
            success: true, 
            message: "Payment recorded successfully" 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 2. GET: Generate Bill for a specific car (Task 12)
 * Fetches details of the car, the service offered, and the payment.
 */
router.get('/payments/bill/:recordId', verifyToken, async (req, res) => {
    try {
        const sql = `
            SELECT 
                P.PaymentNumber, P.AmountPaid, P.PaymentDate,
                SR.ServiceDate, C.PlateNumber, C.Model,
                S.ServiceName, S.ServicePrice,
                U.username AS ReceivedBy
            FROM Payment P
            JOIN ServiceRecord SR ON P.RecordNumber = SR.RecordNumber
            JOIN Car C ON SR.PlateNumber = C.PlateNumber
            JOIN Services S ON SR.ServiceCode = S.ServiceCode
            JOIN users U ON P.ReceivedBy = U.id
            WHERE P.RecordNumber = ?`;
        
        const [bill] = await db.query(sql, [req.params.recordId]);
        
        if (bill.length === 0) {
            return res.status(404).json({ message: "Bill not found" });
        }
        
        res.json(bill[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;