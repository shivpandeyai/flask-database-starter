const API_BASE_URL = 'http://127.0.0.1:5000/api'; // Update if your port is different

// Initialize data on load
document.addEventListener('DOMContentLoaded', () => {
    loadAuthors();
    loadBooks();
});

// ================= AUTHOR FUNCTIONS =================

async function loadAuthors() {
    try {
        const response = await fetch(`${API_BASE_URL}/authors`);
        const data = await response.json();
        
        const list = document.getElementById('author-list');
        const dropdown = document.getElementById('book-author-id');
        
        list.innerHTML = '';
        dropdown.innerHTML = '<option value="">-- Select an Author --</option>';

        data.authors.forEach(auth => {
            // Fill Table
            list.innerHTML += `
                <tr>
                    <td>${auth.id}</td>
                    <td>${auth.name}</td>
                    <td>${auth.email}</td>
                    <td>${auth.bio}</td>
                    <td>${auth.city}</td>
                    <td>
                        <button class="action-btn delete-btn" onclick="deleteAuthor(${auth.id})">Delete</button>
                    </td>
                </tr>`;
            
            // Fill Book Form Dropdown
            dropdown.innerHTML += `<option value="${auth.id}">${auth.name}</option>`;
        });
    } catch (err) { console.error("Error loading authors:", err); }
}

async function addAuthor() {
    const payload = {
        name: document.getElementById('auth-name').value,
        email: document.getElementById('auth-email').value,
        city: document.getElementById('auth-city').value,
        bio: document.getElementById('auth-bio').value
    };

    const response = await fetch(`${API_BASE_URL}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        alert("Author added!");
        loadAuthors(); // Refresh UI
    }
}

async function deleteAuthor(id) {
    if (confirm("Delete this author?")) {
        await fetch(`${API_BASE_URL}/authors/${id}`, { method: 'DELETE' });
        loadAuthors();
    }
}

// ================= BOOK FUNCTIONS =================

async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        const data = await response.json();
        const list = document.getElementById('book-list');
        list.innerHTML = '';

        data.books.forEach(book => {
            list.innerHTML += `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.year || 'N/A'}</td>
                    <td>${book.isbn || 'N/A'}</td>
                    <td>
                        <button class="action-btn delete-btn" onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (err) { console.error("Error loading books:", err); }
}

async function addBook() {
    const payload = {
        title: document.getElementById('book-title').value,
        author_id: document.getElementById('book-author-id').value, // Matches your ForeignKey
        year: document.getElementById('book-year').value,
        isbn: document.getElementById('book-isbn').value
    };

    const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        alert("Book registered!");
        loadBooks();
    } else {
        const err = await response.json();
        alert("Error: " + err.error);
    }
}

async function deleteBook(id) {
    if (confirm("Delete this book?")) {
        await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
        loadBooks();
    }
}