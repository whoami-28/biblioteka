const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'modern_curator_secret_key_2026';
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.run(`CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT,
    total REAL,
    address TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/books', (req, res) => {
    db.all("SELECT * FROM Catalog", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Ошибка при получении каталога" });
        }
        res.json(rows);
    });
});

app.get('/api/archives', (req, res) => {
    db.all("SELECT * FROM Archives", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Ошибка при получении архивов" });
        }
        res.json(rows);
    });
});

app.get('/api/curations', (req, res) => {
    db.all("SELECT * FROM Curations", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Ошибка при получении подборок" });
        }
        res.json(rows);
    });
});

app.get('/api/users', (req, res) => {
    db.all("SELECT id, first_name, last_name, email, role, interests FROM Users", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Ошибка при получении пользователей" });
        }
        res.json(rows);
    });
});

app.get('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    db.get("SELECT * FROM Catalog WHERE id = ?", [bookId], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Ошибка БД" });
        }
        if (!row) {
            return res.status(404).json({ error: "Книга не найдена" });
        }
        res.json(row);
    });
});

app.post('/api/orders', (req, res) => {
    const { items, total, address } = req.body;

    const stmt = db.prepare("INSERT INTO Orders (items, total, address) VALUES (?, ?, ?)");
    
    stmt.run(JSON.stringify(items), total, JSON.stringify(address), function(err) {
        if (err) {
            console.error('Ошибка при сохранении заказа:', err);
            return res.status(500).json({ error: "Ошибка при оформлении заказа" });
        }

        res.json({ success: true, orderId: this.lastID });
    });
    
    stmt.finalize();
});

app.listen(PORT, () => {
    console.log(`Сервер успешно запущен!`);
    console.log(`Главная: http://localhost:${PORT}`);
    console.log(`Каталог: http://localhost:${PORT}/api/books`);
    console.log(`Архивы: http://localhost:${PORT}/api/archives`);
    console.log(`Подборки: http://localhost:${PORT}/api/curations`);
});

// Регистрация
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const stmt = db.prepare("INSERT INTO Users (first_name, email, password_hash, role) VALUES (?, ?, ?, 'user')");
        
        stmt.run(name, email, hashedPassword, function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: "Пользователь с таким email уже существует" });
                }
                return res.status(500).json({ error: "Ошибка при регистрации" });
            }

            const token = jwt.sign({ id: this.lastID, email, role: 'user' }, SECRET_KEY, { expiresIn: '24h' });
            res.json({ success: true, token, user: { id: this.lastID, name, email } });
        });
        stmt.finalize();
    } catch (err) {
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
});

// Вход
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM Users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ error: "Ошибка БД" });
        if (!user) return res.status(400).json({ error: "Пользователь не найден" });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: "Неверный пароль" });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, name: user.first_name, email: user.email } 
        });
    });
});