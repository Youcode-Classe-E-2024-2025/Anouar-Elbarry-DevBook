class BookService {
    constructor(pool) {
        this.pool = pool;
    }

    // Get all books with technology information
    async getAllBooks() {
        try {
            const [books] = await this.pool.query(`
                SELECT 
                    b.*,
                    t.name as technology_name
                FROM book b 
                LEFT JOIN technology t ON b.technology_id = t.id
            `);
            return books;
        } catch (error) {
            console.error('Error fetching books:', error);
            throw new Error('Failed to retrieve books');
        }
    }

    // Get book by ID
    async getBookById(bookId) {
        try {
            const [books] = await this.pool.query(`
                SELECT 
                    b.*,
                    t.name as technology_name
                FROM book b 
                LEFT JOIN technology t ON b.technology_id = t.id
                WHERE b.id = ?
            `, [bookId]);

            if (books.length === 0) {
                throw new Error('Book not found');
            }

            return books[0];
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        }
    }

    // Create a new book
    async createBook(bookData) {
        const { 
            name, 
            price, 
            author, 
            status = 'available', 
            level, 
            technology_id 
        } = bookData;

        // Validate input
        if (!name || !price || !author) {
            throw new Error('Name, price, and author are required');
        }

        try {
            const [result] = await this.pool.query(
                'INSERT INTO book (name, price, author, status, level, technology_id) VALUES (?, ?, ?, ?, ?, ?)',
                [name, price, author, status, level, technology_id]
            );

            return {
                message: 'Book created successfully',
                bookId: result.insertId
            };
        } catch (error) {
            console.error('Error creating book:', error);
            throw new Error('Failed to create book');
        }
    }

    // Update a book
    async updateBook(bookId, bookData) {
        const { 
            name, 
            price, 
            author, 
            status, 
            level, 
            technology_id 
        } = bookData;

        try {
            const [result] = await this.pool.query(
                'UPDATE book SET name = ?, price = ?, author = ?, status = ?, level = ?, technology_id = ? WHERE id = ?',
                [name, price, author, status, level, technology_id, bookId]
            );

            if (result.affectedRows === 0) {
                throw new Error('Book not found');
            }

            return {
                message: 'Book updated successfully',
                bookId: bookId
            };
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    }

    // Delete a book
    async deleteBook(bookId) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM book WHERE id = ?',
                [bookId]
            );

            if (result.affectedRows === 0) {
                throw new Error('Book not found');
            }

            return {
                message: 'Book deleted successfully',
                bookId: bookId
            };
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }

    // Rent a book
    async rentBook(userId, bookId) {
        const connection = await this.pool.getConnection();

        try {
            // Start transaction
            await connection.beginTransaction();

            // Check book availability
            const [books] = await connection.query(
                'SELECT status FROM book WHERE id = ? FOR UPDATE',
                [bookId]
            );

            if (books.length === 0) {
                throw new Error('Book not found');
            }

            if (books[0].status !== 'available') {
                throw new Error('Book is not available for rent');
            }

            // Update book status
            await connection.query(
                'UPDATE book SET status = "rented", due_date = DATE_ADD(CURRENT_DATE, INTERVAL 14 DAY) WHERE id = ?',
                [bookId]
            );

            // Create rental record
            const [rentalResult] = await connection.query(
                'INSERT INTO rental (user_id, book_id) VALUES (?, ?)',
                [userId, bookId]
            );

            // Commit transaction
            await connection.commit();

            return {
                message: 'Book rented successfully',
                rentalId: rentalResult.insertId
            };
        } catch (error) {
            // Rollback transaction in case of error
            await connection.rollback();
            console.error('Error renting book:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    // Return a book
    async returnBook(rentalId) {
        const connection = await this.pool.getConnection();

        try {
            // Start transaction
            await connection.beginTransaction();

            // Find rental details
            const [rentals] = await connection.query(
                'SELECT book_id FROM rental WHERE id = ?',
                [rentalId]
            );

            if (rentals.length === 0) {
                throw new Error('Rental not found');
            }

            const bookId = rentals[0].book_id;

            // Update rental record
            await connection.query(
                'UPDATE rental SET return_date = CURRENT_DATE WHERE id = ?',
                [rentalId]
            );

            // Update book status
            await connection.query(
                'UPDATE book SET status = "available", due_date = NULL WHERE id = ?',
                [bookId]
            );

            // Commit transaction
            await connection.commit();

            return {
                message: 'Book returned successfully',
                bookId: bookId
            };
        } catch (error) {
            // Rollback transaction in case of error
            await connection.rollback();
            console.error('Error returning book:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = BookService;