class Book {
    constructor(id, name, price, author, due_date, level, technology_id) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.author = author;
        this.status = 'available';
        this.due_date = due_date;
        this.level = level;
        this.technology_id = technology_id;
    }

    validate() {
        if (!this.name || this.name.trim() === '') {
            throw new Error('Book name cannot be empty');
        }
        if (this.price <= 0) {
            throw new Error('Price must be a positive number');
        }
        return true;
    }

    getDetails() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            author: this.author,
            status: this.status,
            due_date: this.due_date,
            level: this.level,
            technology_id: this.technology_id
        };
    }

    isAvailable() {
        return this.status === 'available';
    }
}

export default Book;