const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token after "Bearer"

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        console.log("Token received:", token);  // Log the token to see if it's correct

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        console.error("Token verification error:", error);  // Log the error for insight
        res.status(400).json({ message: "Invalid token" });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false,
            message: "Access denied. Admin only." 
        });
    }
    next();
};

module.exports = { protect, adminOnly };
