const bcrypt = require('bcrypt');

class UserService {
    constructor(pool) {
        this.pool = pool;
    }

    async register(name, email, password) {
        // Input validation
        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }

        // Check if user already exists
        const [existingUsers] = await this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            throw new Error('User already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const [result] = await this.pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            [name, email, hashedPassword]
        );

        return {
            message: 'User registered successfully',
            userId: result.insertId
        };
    }

    async login(email, password) {
        // Input validation
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Find user by email
        const [users] = await this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = users[0];

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        return {
            message: 'Login successful',
            userId: user.id,
            name: user.name
        };
    }
}

module.exports = UserService;