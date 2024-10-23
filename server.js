const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const mysql = require('mysql');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'customers',
    port: 3306 // Replace with your XAMPP MySQL port if different
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Endpoint to handle user registration
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    // Check if the user already exists in the database
    const checkQuery = 'SELECT * FROM customers_table WHERE email = ? OR customer_username=?';
    db.query(checkQuery, [email,username], (err, results) => {
        if (err) {
            console.error('Error checking for existing user:', err);
            return res.status(500).json({ message: 'Error checking for existing user.' });
        } 
        
        // If a user with the given email already exists, send a response
        if (results.length > 0) {
            return res.status(400).json({ message: 'Already Registered' });
        }

        // If no user with the given email exists, proceed with registration
        const query = `INSERT INTO customers_table (customer_username, email, password) VALUES (?, ?, ?)`;
        db.query(query, [username, email, password], (err, result) => {
            if (err) {
                console.error('Error inserting data into customers_table:', err);
                return res.status(500).json({ message: 'Error registering user.' });
            }

            res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
        });
    });
});

// Define a basic route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the registration server!');
});

// Define a basic route for the login page
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const query = 'SELECT * FROM customers_table WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        // Compare the password from the user input with the stored password
        if (user.password === password) {
            return res.status(200).json({ message: 'Login successful!' });
        } else {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    });
});







// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
