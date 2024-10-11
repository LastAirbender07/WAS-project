const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const { body, validationResult } = require("express-validator");
const helmet = require("helmet");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.3.1:5173', 'http://192.168.0.106:5173/', '*'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(express.json());
app.use(helmet());

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "webappsec",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to the MySQL database.");
  }
});

// Validation regex patterns
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Letters, numbers, underscores, 3 to 20 characters
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
const scriptTagRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi; // Prevent script tag injection
const sqlInjectionRegex = /('|"|;|--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b)/i; // SQL injection pattern

// Middleware for additional XSS and SQL Injection sanitization
const sanitizeInput = (req, res, next) => {
  const { username, email, password } = req.body;
  
  // XSS Prevention: check for <script> tags
  if (scriptTagRegex.test(username) || scriptTagRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Input contains disallowed script tags." });
  }

  // SQL Injection Prevention: check for SQL injection attempts
  if (sqlInjectionRegex.test(username) || sqlInjectionRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Input contains disallowed SQL commands." });
  }

  next();
};

// Validation middleware for login
const validateLogin = [
  body("email").matches(emailRegex).withMessage("Invalid email address format"),
  body("password").isLength({ min: 64, max: 64 }).withMessage("Invalid password format"),
];

// Validation middleware for registration
const validateRegister = [
  body("username").matches(usernameRegex).withMessage("Username must be alphanumeric, 3-20 characters"),
  body("email").matches(emailRegex).withMessage("Invalid email address format"),
  body("password").isLength({ min: 64, max: 64 }).withMessage("Invalid password format"),
];

// Task validation middleware
const validateTask = [
  body("task.name").notEmpty().withMessage("Task name is required"),
  body("task.priority").isIn(["Low", "Medium", "High"]).withMessage("Invalid priority value"),
  body("task.description").notEmpty().withMessage("Task description is required"),
  body("task.endDate").optional().isISO8601().withMessage("Invalid end date format"),
];

// Error handling helper
const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Hash verification to check if it's SHA-256 hashed
const isSHA256 = (password) => /^[a-f0-9]{64}$/i.test(password);

// Login route
app.post("/login", validateLogin, handleErrors, sanitizeInput, (req, res) => {
  const { email, password } = req.body;

  // Verify the password is SHA-256 hashed before processing
  if (!isSHA256(password)) {
    return res.status(400).json({ success: false, message: "Invalid password format." });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.execute(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = results[0];

    // Compare the SHA-256 hashed password with the bcrypt-hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    return res.json({ success: true, message: "Login successful" });
  });
});

// Register route
app.post("/register", validateRegister, handleErrors, sanitizeInput, async (req, res) => {
  const { username, email, password } = req.body;

  // Verify the password is SHA-256 hashed before proceeding
  if (!isSHA256(password)) {
    return res.status(400).json({ success: false, message: "Invalid password format" });
  }

  // Hash the SHA-256 hashed password again using bcrypt before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.execute(query, [username, email, hashedPassword], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }
    return res.status(201).json({ success: true, message: "Registration successful" });
  });
});

// Add task route
app.post("/add-task", validateTask, handleErrors, sanitizeInput, (req, res) => {
  const { email, task } = req.body;

  // Basic validation for email and task
  if (!email || !task) {
    return res.status(400).json({ success: false, message: "Email and task data are required" });
  }

  const query = `
    INSERT INTO tasks (user_email, name, priority, description, end_date, completed)
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.execute(query, [email, task.name, task.priority, task.description, task.endDate || null, false], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    return res.status(201).json({ success: true, message: "Task added successfully" });
  });
});

// Delete task route (assuming you want this as well)
app.post("/delete-task", sanitizeInput, (req, res) => {
  const { email, task } = req.body;

  if (!email || !task) {
    return res.status(400).json({ success: false, message: "Email and task data are required" });
  }

  const query = "DELETE FROM tasks WHERE user_email = ? AND name = ? AND description = ?";

  db.execute(query, [email, task.name, task.description], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    return res.json({ success: true, message: "Task deleted successfully" });
  });
});

// Add this route to server.js to fetch tasks
app.post("/get-tasks", (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format." });
  }

  const query = "SELECT * FROM tasks WHERE user_email = ?";
  db.execute(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }
    return res.json({ success: true, tasks: results });
  });
});


// Global error handler for catching unexpected errors
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.message);
  return res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
