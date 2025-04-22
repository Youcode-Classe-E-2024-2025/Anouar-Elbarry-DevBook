CREATE DATABASE devbooks;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE technology (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    author VARCHAR(100),
    status ENUM('available', 'rented') DEFAULT 'available',
    due_date DATE,
    level VARCHAR(50),
    technology_id INT,
    FOREIGN KEY (technology_id) REFERENCES technology(id)
);

CREATE TABLE rental (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    rent_date DATE DEFAULT CURRENT_DATE,
    return_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES book(id)
);