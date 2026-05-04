const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get token from header (usually format is 'Bearer TOKEN')
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Add user data to the request object
        next(); // Move to the next function (the actual route)
    } catch (err) {
        res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = verifyToken;