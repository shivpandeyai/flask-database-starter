#================-Importing necessary modules ===================   

from flask import Flask, render_template, request, redirect
import sqlite3

#================== Creating Flask app ===================
app = Flask(__name__)

#================= Database file name (will be created automatically) ===================
DATABASE = 'add_sample_students.db'  

#================== Database helper function to connect to the database ===================
def get_db_connection():
    """Create a connection to the database"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with students table"""
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        course TEXT NOT NULL
    )''')
    conn.execute('''INSERT INTO students (name, email, course) 
        VALUES (?, ?, ?)
    ''', ('John Doe', 'john@example.com', 'Computer Science'))
    conn.commit()
    conn.close()
    return 'Database initialized and sample student added!'

@app.route('/')
def index():
    """Display all students"""
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM students').fetchall()
    conn.close()
    return render_template('index.html', students=students)

@app.route('/add', methods=['GET', 'POST'])
def add():
    """Add a new student to database"""
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        course = request.form['course']
        
        conn = get_db_connection()
        conn.execute('INSERT INTO students (name, email, course) VALUES (?, ?, ?)',
                     (name, email, course))
        conn.commit()
        conn.close()
        
        return redirect('/')
    
    return render_template('add_student.html')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)