<<<<<<< HEAD
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!');
    } else if (req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('About page');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3000;
// Start the server and listen on the specified port
exports.divide = (a, b) => {
    if (b === 0) throw new Error('division by zero');
    return a / b;
};
=======
>>>>>>> parent of b079b55 (updated code and comments)
