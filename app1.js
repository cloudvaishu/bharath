<<<<<<< HEAD
const http = require('http');
const { URL } = require('url');

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
function safeDivide(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') throw new TypeError('operands must be numbers');
    if (y === 0) throw new RangeError('cannot divide by zero');
    return x / y;
}

const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);

    if (reqUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', message: 'Hi there!' }));
        return;
    }

    if (reqUrl.pathname === '/info') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ app: 'example', version: '1.0.0' }));
        return;
    }

    if (reqUrl.pathname === '/math/divide') {
        const a = parseFloat(reqUrl.searchParams.get('a'));
        const b = parseFloat(reqUrl.searchParams.get('b'));
        try {
            const result = safeDivide(a, b);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ result }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'not found' }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

module.exports = { server, safeDivide };