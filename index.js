const http = require('http');
const fs = require('fs');

// Load users from file
let users = [];
fs.readFile('users.json', (err, data) => {
  if (!err) {
    users = JSON.parse(data);
  }
});

// Save users to file
function saveUsersToFile() {
  fs.writeFile('users.json', JSON.stringify(users), err => {
    if (err) {
      console.error('Error saving users to file:', err);
    }
  });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set response headers
  res.setHeader('Content-Type', 'application/json');

  // Handle POST requests to create users
  if (req.method === 'POST' && req.url === '/users') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
    const newUser=JSON.parse(body);
      users.push(newUser);
      saveUsersToFile();
      res.statusCode = 201;
      res.end(JSON.stringify(newUser));
    });
  }

  // Handle GET requests to get all users
  else if (req.method === 'GET' && req.url === '/users') {
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  }

  // Handle POST requests for user authentication
  else if (req.method === 'POST' && req.url === '/users/authenticate') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
      const credentials = JSON.parse(body);
      const { username, password } = credentials;
      const authenticatedUser = users.find(user => user.username === username && user.password === password);
      if (authenticatedUser) {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Authentication successful' }));
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Authentication failed' }));
      }
    });
  }

  // Handle POST requests to create books, DELETE requests to delete books, etc.
    // Handle POST requests to create books
    else if (req.method === 'POST' && req.url === '/books') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
      });
      req.on('end', () => {
        const newBook = JSON.parse(body);
        books.push(newBook);
        saveBooksToFile();
        res.statusCode = 201;
        res.end(JSON.stringify(newBook));
      });
    }

    // Handle DELETE requests to delete a book
    else if (req.method === 'DELETE' && req.url.startsWith('/books/')) {
      const bookId = req.url.split('/')[2];
      const index = books.findIndex(book => book.id === bookId);
      if (index !== -1) {
        books.splice(index, 1);
        saveBooksToFile();
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Book deleted successfully' }));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Book not found' }));
      }
    }

    // Handle POST requests to loan out a book
    else if (req.method === 'POST' && req.url === '/books/loan') {
      // Loaning logic here
    }

    // Handle POST requests to return a book
    else if (req.method === 'POST' && req.url === '/books/return') {
      // Returning logic here
    }

    // Handle PUT requests to update a book
    else if (req.method === 'PUT' && req.url.startsWith('/books/')) {
      const bookId = req.url.split('/')[2];
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
      });
      req.on('end', () => {
        const updatedBook = JSON.parse(body);
        const index = books.findIndex(book => book.id === bookId);
        if (index !== -1) {
          books[index] = { ...books[index], ...updatedBook };
          saveBooksToFile();
          res.statusCode = 200;
          res.end(JSON.stringify(books[index]));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Book not found' }));
        }
      });
    }

  // Handle other routes
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});