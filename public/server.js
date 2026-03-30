const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

app.use(express.json());
app.use(express.static(__dirname));

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

app.listen(PORT, () => {
    console.log(`Сервер успешно запущен!`);
    console.log(`Главная: http://localhost:${PORT}`);
    console.log(`Каталог: http://localhost:${PORT}/api/books`);
    console.log(`Архивы: http://localhost:${PORT}/api/archives`);
    console.log(`Подборки: http://localhost:${PORT}/api/curations`);
});