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
                        <button class="action-btn edit-btn" onclick="editAuthor(${auth.id})"> Edit </button>
                        <button class="action-btn delete-btn" onclick="deleteAuthor(${auth.id})"> Delete </button>
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


// --- Modal Controls ---
function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}
    

// --- Edit Author Trigger ---
async function editAuthor(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/authors/${id}`);
        const data = await response.json();
        const auth = data.author;

        // Fill modal fields
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-type').value = 'author';
        document.getElementById('edit-auth-name').value = auth.name;
        document.getElementById('edit-auth-email').value = auth.email;
        document.getElementById('edit-auth-city').value = auth.city;
        document.getElementById('edit-auth-bio').value = auth.bio;

        // Show modal and specific fields
        document.getElementById('modal-title').innerText = "Edit Author";
        document.getElementById('edit-author-fields').classList.remove('hidden');
        document.getElementById('edit-book-fields').classList.add('hidden');
        document.getElementById('edit-modal').classList.remove('hidden');
    } catch (err) { alert("Error fetching author data"); }
}

// --------- Delete Author Function (Verify Spelling) ---------
async function deleteAuthor(id) {
    if (confirm("Are you sure you want to delete this author?")) {
        try {
            const response = await fetch(`${API_BASE_URL}/authors/${id}`, { 
                method: 'DELETE' 
            });

            if (response.ok) {
                alert("Author deleted!");
                loadAuthors(); // Refresh UI
            } else {
                const result = await response.json();
                alert("Error: " + result.error);
            }
        } catch (err) {
            console.error("Error deleting author:", err);
        }
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
                        <button class="action-btn edit-btn" onclick="editBook(${book.id})"> Edit </button>
                        <button class="action-btn delete-btn" onclick="deleteBook(${book.id})"> Delete </button>
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

// --- Edit Book Trigger ---
async function editBook(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`);
        const data = await response.json();
        const book = data.book;

        // Fill modal fields
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-type').value = 'book';
        document.getElementById('edit-book-title').value = book.title;
        document.getElementById('edit-book-year').value = book.year;
        document.getElementById('edit-book-isbn').value = book.isbn;

        // Show modal and specific fields
        document.getElementById('modal-title').innerText = "Edit Book";
        document.getElementById('edit-book-fields').classList.remove('hidden');
        document.getElementById('edit-author-fields').classList.add('hidden');
        document.getElementById('edit-modal').classList.remove('hidden');
    } catch (err) { alert("Error fetching book data"); }
}

// --------- Refined Delete Book Function ---------
async function deleteBook(id) {
    if (confirm("Are you sure you want to delete this book?")) {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, { 
                method: 'DELETE' 
            });

            if (response.ok) {
                alert("Book deleted successfully!");
                loadBooks(); // Refresh the table
            } else {
                const result = await response.json();
                alert("Error: " + result.error);
            }
        } catch (err) {
            console.error("Error deleting book:", err);
        }
    }
}

// --- Universal Save Function ---
async function saveEdit() {
    const id = document.getElementById('edit-id').value;
    const type = document.getElementById('edit-type').value;
    let payload = {};
    let endpoint = "";

    if (type === 'author') {
        endpoint = `${API_BASE_URL}/authors/${id}`;
        payload = {
            name: document.getElementById('edit-auth-name').value,
            email: document.getElementById('edit-auth-email').value,
            city: document.getElementById('edit-auth-city').value,
            bio: document.getElementById('edit-auth-bio').value
        };
    } else {
        endpoint = `${API_BASE_URL}/books/${id}`;
        payload = {
            title: document.getElementById('edit-book-title').value,
            year: document.getElementById('edit-book-year').value,
            isbn: document.getElementById('edit-book-isbn').value
        };
    }

    const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        alert("Updated successfully!");
        closeModal();
        type === 'author' ? loadAuthors() : loadBooks();
    } else {
        alert("Update failed.");
    }
}