const http = require('http');
const fs = require('fs').promises;
const path = require('path');

/**
 * app2.js - Simple Node.js example server
 *
 * Features:
 * - GET /         -> basic HTML with links
 * - GET /time     -> returns current server time as JSON
 * - GET /data     -> returns JSON saved to ./data.json (404 if missing)
 * - POST /data    -> accepts JSON body, saves to ./data.json, returns saved content
 * - POST /echo    -> echoes back any JSON body
 *
 * Run: node app2.js
 */


const PORT = process.env.PORT || 3000;
const DATA_FILE = path.resolve(__dirname, 'data.json');

function sendJSON(res, obj, status = 200) {
    const payload = JSON.stringify(obj, null, 2);
    res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) });
    res.end(payload);
}

function sendText(res, text, status = 200) {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(text);
}

async function parseJSONBody(req) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString();
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (err) {
        const e = new Error('Invalid JSON');
        e.code = 'INVALID_JSON';
        throw e;
    }
}

const server = http.createServer(async (req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '')) {
            const html = [
                '<!doctype html><html><head><meta charset="utf-8"><title>app2</title></head><body>',
                '<h1>Node.js Example</h1>',
                '<ul>',
                '<li><a href="/time">/time</a> - server time (JSON)</li>',
                '<li><a href="/data">/data</a> - read saved JSON</li>',
                '</ul>',
                '<p>Use POST /data to save JSON, POST /echo to echo JSON.</p>',
                '</body></html>'
            ].join('');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/time') {
            return sendJSON(res, { serverTime: new Date().toISOString() });
        }

        if (req.method === 'GET' && url.pathname === '/data') {
            try {
                const raw = await fs.readFile(DATA_FILE, 'utf8');
                const obj = JSON.parse(raw);
                return sendJSON(res, obj);
            } catch (err) {
                if (err.code === 'ENOENT') return sendJSON(res, { error: 'no data found' }, 404);
                throw err;
            }
        }

        if (req.method === 'POST' && url.pathname === '/data') {
            const body = await parseJSONBody(req);
            if (!body) return sendJSON(res, { error: 'empty body' }, 400);
            await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8');
            return sendJSON(res, { saved: true, data: body }, 201);
        }

        if (req.method === 'POST' && url.pathname === '/echo') {
            const body = await parseJSONBody(req);
            if (!body) return sendJSON(res, { echoed: null });
            return sendJSON(res, { echoed: body });
        }

        // Not found
        sendJSON(res, { error: 'not found' }, 404);
    } catch (err) {
        if (err.code === 'INVALID_JSON') {
            return sendJSON(res, { error: 'invalid json' }, 400);
        }
        console.error('Server error:', err);
        sendJSON(res, { error: 'internal server error' }, 500);
    }
});

// graceful shutdown
function shutdown(signal) {
    console.log(`Received ${signal}, shutting down...`);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    // force exit after timeout
    setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});