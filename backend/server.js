const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_kenko_maindb"
});
const bodyParser = require('body-parser');

// Use body-parser middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

// Handle form submission for monthly program
app.post('/submit-monthly', (req, res) => {
    const { name, category, gender, contact, birthdate, note, program, package } = req.body;

    // Create the 'monthlytbl' table if it doesn't exist
    const createTableSql = `CREATE TABLE IF NOT EXISTS monthlytbl (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        gender VARCHAR(255) NOT NULL,
        contact VARCHAR(255) NOT NULL,
        birthdate DATE NOT NULL,
        note VARCHAR(255),
        program INT NOT NULL,
        package INT NOT NULL
    )`;
    db.query(createTableSql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            return res.status(500).send('Error creating table');
        }

        // Insert data into the 'monthlytbl' table
        const insertSql = `INSERT INTO monthlytbl (name, category, gender, contact, birthdate, note, program, package) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertSql, [name, category, gender, contact, birthdate, note, program, package], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error inserting data');
            }

            console.log('Data inserted successfully');
            return res.status(200).send('Data inserted successfully');
        });
    });
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'kenko_home.html'));
});

// Route to serve the Kenko_Monthly.html file
app.get('/backend/Kenko_Monthly.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Kenko_Monthly.html'));
});
app.get('/backend/Kenko_Sales.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Kenko_Sales.html'));
});

app.get('/backend/Kenko_Session.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Kenko_Session.html'));
});
app.post('/submit-session', (req, res) => {
    const { customer, package } = req.body;

    // Set the current time for Time_in
    const timeIn = new Date().toISOString().slice(11, 19);

    // Insert data into the 'session_details' table
    const insertSql = `INSERT INTO session_details (Name, Time_in, Package) VALUES (?, ?, ?)`;
    db.query(insertSql, [customer, timeIn, package], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }

        console.log('Data inserted successfully');
        return res.status(200).send('Data inserted successfully');
    });
});

app.get('/backend/Kenko_SessionTbl.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Kenko_SessionTbl.html'));
});
// Route to serve the Kenko_Monthly.html file
app.get('/backend/Kenko_Dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Kenko_Dashboard.html'));
});
// Route to fetch package names from the database
app.get('/packages', (req, res) => {
    const query = 'SELECT Package_ID, Name FROM packages WHERE Package_ID IN (4, 5, 6)';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching package names:', err);
            res.status(500).send('Error fetching package names');
            return;
        }
        res.json(results);
    });
});

app.get('/fetch-dataSession', (req, res) => {
    const query = 'SELECT Name, Package, Time_in, Time_out FROM Session_details';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching session details:', err);
            res.status(500).send('Error fetching session details');
            return;
        }
        res.json(results);
    });
});
app.get('/fetch-session-details', (req, res) => {
    // Use the pool to query the database
    pool.query('SELECT * FROM session_details', (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Send the fetched data as a JSON response
        res.json(results);
    });
});
app.post('/update-session', (req, res) => {
    const { name, packageName, timeIn, currentTime } = req.body;

    console.log('Updating session:', { name, packageName, timeIn, currentTime });

    const updateSql = `UPDATE session_details SET Time_out = ? WHERE Name = ? AND Package = ? AND Time_in = ?`;
    db.query(updateSql, [currentTime, name, packageName, timeIn], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).send('Error updating data');
        }

        console.log('Data updated successfully');
        return res.status(200).send('Data updated successfully');
    });
});

// Route to fetch sales data
app.get('/get-sales-data', (req, res) => {
    connection.query('SELECT * FROM sales', (err, results) => {
        if (err) {
            console.error('Error fetching sales data:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});


// Route to fetch data from the database and send it to the client
app.get('/fetch-data', (req, res) => {
    const query = 'SELECT name, category, gender, contact, address, program, sign_up, note, birthdate, package FROM monthlytbl';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(results);
    });
    app.get('/kenko-sales', (req, res) => {
        res.sendFile(path.join(__dirname, 'kenko_sales.html'));
    });
    
});

app.listen(8082, () => {
    console.log("Listening on port 8082...");
});
