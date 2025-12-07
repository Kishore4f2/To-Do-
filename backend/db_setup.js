const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kishore'
});

db.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected to MySQL server.');

    db.query('CREATE DATABASE IF NOT EXISTS todo', (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
            process.exit(1);
        }
        console.log('Database "todo" created or already exists.');

        db.changeUser({ database: 'todo' }, (err) => {
            if (err) {
                console.error('Error switching to database "todo":', err);
                process.exit(1);
            }
            console.log('Switched to database "todo".');

            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS todoItems (
                    ID INT AUTO_INCREMENT PRIMARY KEY,
                    itemDescription VARCHAR(255) NOT NULL
                )
            `;

            db.query(createTableQuery, (err, result) => {
                if (err) {
                    console.error('Error creating table:', err);
                    process.exit(1);
                }
                console.log('Table "todoItems" created or already exists.');
                db.end();
            });
        });
    });
});
