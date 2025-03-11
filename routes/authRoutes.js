const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Test route
router.get("/test", (req, res) => {
    res.json({ message: "Auth route is working" });
});

// Add this at the top of your routes
router.get("/ping", (req, res) => {
    res.json({ message: "Auth server is responding" });
});

// Register route
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Detailed request logging
        console.log('Registration request received:', {
            username,
            email,
            roleFromBody: role,
            rawBody: req.body
        });

        // Strict role validation
        if (role !== 'admin' && role !== 'user') {
            console.log('Invalid role specified:', role);
            return res.status(400).json({
                success: false,
                message: `Invalid role specified: ${role}`
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Log SQL parameters
        console.log('Executing SQL with parameters:', {
            username,
            email,
            role
        });

        // Insert user with explicit role
        const [result] = await db.query(
            `INSERT INTO users (username, email, password, role) 
             VALUES (?, ?, ?, ?)`,
            [username, email, hashedPassword, role]
        );

        // Verify the insertion immediately
        const [newUser] = await db.query(
            "SELECT id, username, email, role FROM users WHERE id = ?",
            [result.insertId]
        );

        console.log('User created in database:', newUser[0]);

        if (!newUser[0] || newUser[0].role !== role) {
            console.error('Role mismatch or user creation failed:', {
                requestedRole: role,
                createdRole: newUser[0]?.role
            });
            throw new Error('User creation failed or role mismatch');
        }

        const token = jwt.sign(
            { 
                id: newUser[0].id,
                username: newUser[0].username,
                email: newUser[0].email,
                role: newUser[0].role
            },
            process.env.JWT_SECRET || 'your-secret-key'
        );

        res.json({
            success: true,
            token,
            user: newUser[0]
        });
    } catch (error) {
        console.error("Registration error details:", error);
        res.status(500).json({ 
            success: false, 
            message: "Registration failed", 
            error: error.message,
            details: error.stack
        });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Get user from database with role
        const [users] = await db.query(
            "SELECT id, username, email, password, role FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = users[0];
        console.log('Found user:', { ...user, password: '***' }); // Log user data without password

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role // Include role in token
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        // Send complete user data in response
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role // Make sure role is included
            }
        });
    } catch (error) {
        console.error("Login error details:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

// Verify token route
router.get("/verify", protect, (req, res) => {
    res.json({ success: true, user: req.user });
});

// Add this route to test the database setup
router.get("/test-db", async (req, res) => {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM users WHERE Field = "role"');
        const [sampleUsers] = await db.query('SELECT id, username, role FROM users LIMIT 5');
        
        res.json({
            roleColumn: columns[0],
            sampleUsers,
            message: 'Database check complete'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: 'Database check failed'
        });
    }
});

module.exports = router;