const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

/**
 * TASK 13: Generate Daily Reports
 * Indicates: Service Date, Plate Number, Service Name, and Amount Paid.
 */
// Modify the /reports/daily route
router.get('/reports/daily', verifyToken, async (req, res) => {
    try {
        // Get date from query params (e.g., /api/reports/daily?date=2026-05-06)
        const selectedDate = req.query.date; 
        
        let sql = `
            SELECT 
                DATE_FORMAT(SR.ServiceDate, '%Y-%m-%d %H:%i') AS Date,
                C.PlateNumber,
                C.Model,
                S.ServiceName,
                P.AmountPaid,
                U.username AS Mechanic
            FROM ServiceRecord SR
            JOIN Car C ON SR.PlateNumber = C.PlateNumber
            JOIN Services S ON SR.ServiceCode = S.ServiceCode
            JOIN Payment P ON SR.RecordNumber = P.RecordNumber
            JOIN users U ON P.ReceivedBy = U.id
            WHERE DATE(SR.ServiceDate) = ?
            ORDER BY SR.ServiceDate DESC`;

        // Default to current date if none provided
        const queryDate = selectedDate || new Date().toISOString().split('T')[0];

        const [reportData] = await db.query(sql, [queryDate]);
        
        const totalRevenue = reportData.reduce((sum, item) => sum + parseFloat(item.AmountPaid), 0);

        res.json({
            success: true,
            date: queryDate,
            totalRevenue,
            data: reportData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * EXTRA: Summary Statistics (Total cars repaired, etc.)
 * Great for showing off in the exam!
 */
router.get('/reports/summary', verifyToken, async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM Car) as totalCars,
                (SELECT COUNT(*) FROM ServiceRecord) as totalServices,
                (SELECT SUM(AmountPaid) FROM Payment) as totalEarnings
        `);
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;    