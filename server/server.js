const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const UserService = require('./UserService');
const BookService = require('../service/BookService');

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

const userService = new UserService(pool);
const bookService = new BookService(pool);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/index.html'))
})
app.get('/login',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/login.html'))
})
app.get('/register',(req,res) => {
  res.sendFile(path.join(__dirname,'../public/register.html'))
})
app.get('/books', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/books.html'));
});

app.get('/admin/book_rent',(req,res) =>{
    res.sendFile(path.join(__dirname,'../public/book_Rental.html'))
})

// User Registration 
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await userService.register(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// User Login 
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get book 
app.get('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await bookService.getBookById(bookId);
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(404).json({ error: error.message });
  }
});

// Create a new book
app.post('/api/books', async (req, res) => {
  try {
    const bookData = req.body;
    const result = await bookService.createBook(bookData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update a book 
app.put('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const bookData = req.body;
    const result = await bookService.updateBook(bookId, bookData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a book 
app.delete('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const result = await bookService.deleteBook(bookId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(400).json({ error: error.message });
  }
});

// Rent a book
app.post('/api/books/rent', async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const result = await bookService.rentBook(userId, bookId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error renting book:', error);
    res.status(400).json({ error: error.message });
  }
});

// Return a book
app.post('/api/books/return', async (req, res) => {
  try {
    const { rentalId } = req.body;
    const result = await bookService.returnBook(rentalId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});