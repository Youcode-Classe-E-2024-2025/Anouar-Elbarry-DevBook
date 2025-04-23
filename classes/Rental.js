class Rental {
    constructor(id,user_id,book_id,rent_date,return_date){
        this.id = id;
        this.user_id = user_id;
        this.book_id = book_id;
        this.rent_date = rent_date;
        this.return_date = return_date;
    }

    validate() {

        if (!this.book_id || !this.user_id || !this.rent_date) {
            throw new Error('Book ID,User ID, and Rent Date must not be empty');
        }

        if (this.return_date) {
            const returnDate = new Date(this.return_date);
            if (isNaN(returnDate.getTime())) {
                throw new Error('Invalid return date format');
            }

            if (returnDate < rentDate) {
                throw new Error('Return date must be after or equal to rent date');
            }
        }
        return true;
    }

    isActive() {
        const now = new Date();
        const rentDate = new Date(this.rent_date);
        
        if (this.return_date) {
            const returnDate = new Date(this.return_date);
            return rentDate <= now && now <= returnDate;
        }
        return rentDate <= now;
    }
}

export default Rental;