const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'modern_curator_secret_key_2026'; 

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        items TEXT,
        total REAL,
        address TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run("ALTER TABLE Orders ADD COLUMN user_id INTEGER", () => {});
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "Необходима авторизация" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Неверный или просроченный токен" });
        req.user = user;
        next();
    });
};

app.get('/api/books', (req, res) => { db.all("SELECT * FROM Catalog", [], (err, rows) => { res.json(rows); }); });
app.get('/api/archives', (req, res) => { db.all("SELECT * FROM Archives", [], (err, rows) => { res.json(rows); }); });
app.get('/api/curations', (req, res) => { db.all("SELECT * FROM Curations", [], (err, rows) => { res.json(rows); }); });
app.get('/api/books/:id', (req, res) => {
    db.get("SELECT * FROM Catalog WHERE id = ?", [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "Книга не найдена" });
        res.json(row);
    });
});

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const stmt = db.prepare("INSERT INTO Users (first_name, email, password_hash, role) VALUES (?, ?, ?, 'user')");
        stmt.run(name, email, hashedPassword, function(err) {
            if (err) return res.status(400).json({ error: "Пользователь с таким email уже существует" });
            const token = jwt.sign({ id: this.lastID, email, role: 'user' }, SECRET_KEY, { expiresIn: '24h' });
            res.json({ success: true, token });
        });
    } catch (err) { res.status(500).json({ error: "Ошибка сервера" }); }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM Users WHERE email = ?", [email], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: "Пользователь не найден" });
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: "Неверный пароль" });
        
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ success: true, token });
    });
});

app.get('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    db.get("SELECT id, first_name, email, role FROM Users WHERE id = ?", [userId], (err, user) => {
        if (err || !user) return res.status(500).json({ error: "Ошибка получения профиля" });
        
        db.all("SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC", [userId], (err, orders) => {
            res.json({ user, orders: orders || [] });
        });
    });
});

app.post('/api/orders', authenticateToken, (req, res) => {
    const { items, total, address } = req.body;
    const userId = req.user.id;

    const stmt = db.prepare("INSERT INTO Orders (user_id, items, total, address) VALUES (?, ?, ?, ?)");
    stmt.run(userId, JSON.stringify(items), total, JSON.stringify(address), function(err) {
        if (err) return res.status(500).json({ error: "Ошибка при оформлении заказа" });
        res.json({ success: true, orderId: this.lastID });
    });
    stmt.finalize();
});

app.get('/api/search', (req, res) => {
    const q = req.query.q || '';
    if (!q.trim()) return res.json({ books: [], archives: [], curations: [] });

    const searchPattern = `%${q}%`;
    const results = {};

    db.serialize(() => {
        db.all("SELECT * FROM Catalog WHERE title LIKE ? OR author LIKE ?", [searchPattern, searchPattern], (err, books) => {
            results.books = books || [];

            db.all("SELECT * FROM Archives WHERE title LIKE ? OR description LIKE ?", [searchPattern, searchPattern], (err, archives) => {
                results.archives = archives || [];

                db.all("SELECT * FROM Curations WHERE title LIKE ? OR description LIKE ?", [searchPattern, searchPattern], (err, curations) => {
                    results.curations = curations || [];

                    res.json(results);
                });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}/auth.html`);
});