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
  database: 'devbook',
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});