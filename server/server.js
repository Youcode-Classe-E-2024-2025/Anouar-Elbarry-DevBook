const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'jppp5734',
  database: 'devbooks',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/index.html'))
})
app.get('/books', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/books.html'));
});

app.get('/admin/book_rent',(req,res) =>{
    res.sendFile(path.join(__dirname,'../public/book_Rental.html'))
})

app.get('/api/books', async (req, res) => {
    try {
      // First, check database connection
      const connection = await pool.getConnection();
      
      // Log connection details
      console.log('Database connection successful');
      console.log('Connected to database:', connection.connection.config.database);
      
      // Release the connection
      connection.release();

      // Attempt to fetch books
      const [books] = await pool.query(`
        SELECT 
        b.*,
        t.name as technology_name
        FROM book b 
        LEFT JOIN technology t ON b.technology_id = t.id
      `);
      
      // Log query results
      console.log(`Retrieved ${books.length} books`);
      
      // Send response
      res.status(200).json(books);
    } catch(error) {
      // Comprehensive error logging
      console.error('FULL ERROR DETAILS:');
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);

      // Send detailed error response
      res.status(500).json({ 
        error: 'Failed to fetch books', 
        details: error.message,
        fullError: error.toString()
      });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});