const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("ALTER TABLE Users ADD COLUMN password_hash TEXT", (err) => {
        if (err) {
            if (err.message.includes('duplicate column')) {
                console.log('Колонка уже существует! Вам не нужно ничего менять.');
            } else {
                console.error('Ошибка:', err.message);
            }
        } else {
            console.log('✅ Колонка password_hash успешно добавлена в таблицу Users!');
        }
    });
});

db.close();