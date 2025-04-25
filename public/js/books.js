let books = [];
document.addEventListener('DOMContentLoaded', async (req,res) => {
        const container = document.getElementById('books_Container');
    try {
        const response = await fetch('http://localhost:3000/api/books');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        console.log('Books loaded:', books);
        
        

        books.forEach(book => {
        let card = creatCard(book);
        container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error fetching books:', error);
    }

    function creatCard(book){
        const card = document.createElement('div');
        card.innerHTML = `
         <div class='book-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl'>
                <div class='p-6'>
                    <h3 class='text-xl font-semibold text-gray-800 mb-4'>${book.name}</h3>
                    <div class='space-y-2 text-gray-600 mb-4'>
                        <p><strong>Author:</strong>${book.author}</p>
                        <p><strong>Price:</strong> ${book.price}</p>
                        <p><strong>Technology:</strong> ${book.technology_name}</p>
                        <p><strong>Level:</strong>${book.level}</p>
                    </div>
                    <button class='w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition">
                        Rent Book
                    </button>
                </div>
            </div>
        `;
        return card;
    }
});