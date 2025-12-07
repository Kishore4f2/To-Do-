const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const mysql = require('mysql2');

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection with Environment Variables support
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'kishore',
    database: process.env.DB_NAME || 'todo',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.log('Database connection failed', err);
        return;
    }
    console.log('Connected to database');
});

// Serve the HTML file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/todolist.html'));
});

app.get('/get-items', (req, res) => {
    const query = "SELECT * FROM todoItems";
    db.query(query, (err, result) => {
        if (err) {
            console.log('Error fetching items', err);
            res.status(500).send('Error fetching items');
            return;
        }
        res.status(200).send(result);
    });
});

app.post('/add-item', (req, res) => {
    const query = "INSERT INTO todoItems(itemDescription) VALUES (?)";
    db.query(query, [req.body.text], (err, result) => {
        if (err) {
            console.log('Error inserting item', err);
            res.status(500).send('Error inserting item');
            return;
        }
        console.log('Item inserted successfully');
        res.status(201).send({ success: true, insertId: result.insertId });
    });
});

app.put('/edit-item', (req, res) => {
    const { ID, itemDescription } = req.body;
    const query = "UPDATE todoItems SET itemDescription = ? WHERE ID = ?";
    db.query(query, [itemDescription, ID], (err, result) => {
        if (err) {
            console.log('Error updating item', err);
            res.status(500).send('Error updating item');
            return;
        }
        console.log('Item updated successfully');
        res.status(200).send({ success: true });
    });
});

app.delete('/delete-item', (req, res) => {
    const { ID } = req.body;
    const query = "DELETE FROM todoItems WHERE ID = ?";
    db.query(query, [ID], (err, result) => {
        if (err) {
            console.log('Error deleting item', err);
            res.status(500).send('Error deleting item');
            return;
        }
        console.log('Item deleted successfully');
        res.status(200).send({ success: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});