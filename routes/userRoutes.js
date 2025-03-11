const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const db = require("../config/db");

// Get all users
router.get("/", async (req, res) => {
    try {
        console.log('Attempting to fetch users...');
        const [rows] = await db.query(
            'SELECT id, username, email FROM users ORDER BY id DESC'  // Excluding password for security
        );
        console.log('Fetched users:', rows);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            message: 'Error fetching users',
            error: error.message 
        });
    }
});

// Get user profile
router.get("/profile", protect, async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, username, email FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ success: true, user: users[0] });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

module.exports = router;