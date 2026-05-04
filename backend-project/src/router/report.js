const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

/**
 * TASK 13: Generate Daily Reports
 * Indicates: Service Date, Plate Number, Service Name, and Amount Paid.
 */
router.get('/reports/daily', verifyToken, async (req, res) => {
    try {
        const sql = `
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
            WHERE DATE(SR.ServiceDate) = CURDATE()
            ORDER BY SR.ServiceDate DESC`;

        const [reportData] = await db.query(sql);
        
        // Calculate Total Revenue for the day
        const totalRevenue = reportData.reduce((sum, item) => sum + parseFloat(item.AmountPaid), 0);

        res.json({
            success: true,
            date: new Date().toISOString().split('T')[0],
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