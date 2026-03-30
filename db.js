const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Массивы с данными для заполнения
const users = [
    { first_name: 'Джулиан', last_name: 'Вэйн', email: 'j.vane@curator.com', role: 'admin', interests: 'Архитектура' },
    { first_name: 'Элена', last_name: 'Торн', email: 'e.thorn@curator.com', role: 'user', interests: 'Типографика' },
    { first_name: 'Маркус', last_name: 'Чен', email: 'm.chen@curator.com', role: 'user', interests: 'Модернизм' },
    { first_name: 'Изабелла', last_name: 'Росси', email: 'i.rossi@curator.com', role: 'user', interests: 'Классика' },
    { first_name: 'Виктор', last_name: 'Пелевин', email: 'v.pelevin@curator.com', role: 'user', interests: 'Философия' },
    { first_name: 'Сара', last_name: 'Коннор', email: 's.connor@curator.com', role: 'user', interests: 'Архивы' },
    { first_name: 'Алан', last_name: 'Тьюринг', email: 'a.turing@curator.com', role: 'user', interests: 'Теория' },
    { first_name: 'Мария', last_name: 'Кюри', email: 'm.curie@curator.com', role: 'user', interests: 'Наука' },
    { first_name: 'Джон', last_name: 'Доу', email: 'j.doe@curator.com', role: 'user', interests: 'Дизайн' },
    { first_name: 'Алиса', last_name: 'Лидделл', email: 'a.liddell@curator.com', role: 'user', interests: 'Литература' }
];

const catalog = [
    { title: 'Архитектор Тишины', author: 'Элена Торн', category: 'architecture', price: 124.0, format: 'Твердый переплет', pages: 342 },
    { title: 'Немой Структурализм', author: 'Джулиан Барнс-Хоффер', category: 'typography', price: 85.0, format: 'Мягкая обложка', pages: 210 },
    { title: 'Сансы Времени: Том IV', author: 'Маркус Чен', category: 'typography', price: 110.0, format: 'Твердый переплет', pages: 400 },
    { title: 'Конкретная Поэзия', author: 'Изабелла Росси', category: 'architecture', price: 95.0, format: 'Мягкая обложка', pages: 150 },
    { title: 'Этика Брутализма', author: 'Виктор Пелевин', category: 'philosophy', price: 150.0, format: 'Твердый переплет', pages: 500 },
    { title: 'Модернистский Проект', author: 'Элена Вэнс', category: 'design', price: 130.0, format: 'Твердый переплет', pages: 320 },
    { title: 'Отголоски Формы', author: 'Сато Кензо', category: 'architecture', price: 145.0, format: 'Твердый переплет', pages: 280 },
    { title: 'Теория Пустоты', author: 'Алан Тьюринг', category: 'theory', price: 90.0, format: 'Мягкая обложка', pages: 180 },
    { title: 'Свет и Тень', author: 'Мария Кюри', category: 'science', price: 105.0, format: 'Твердый переплет', pages: 250 },
    { title: 'Анатомия Шрифта', author: 'Джон Доу', category: 'typography', price: 75.0, format: 'Мягкая обложка', pages: 120 },
    { title: 'Городское Эхо', author: 'Л.Дж. Мерсер', category: 'architecture', price: 115.0, format: 'Твердый переплет', pages: 310 },
    { title: 'Основы Света', author: 'Дэвид М. Холл', category: 'design', price: 140.0, format: 'Твердый переплет', pages: 420 },
    { title: 'Серый Коридор', author: 'С.Дж. Арис', category: 'philosophy', price: 80.0, format: 'Мягкая обложка', pages: 190 },
    { title: 'Линии и Формы', author: 'Алиса Лидделл', category: 'art', price: 160.0, format: 'Твердый переплет', pages: 360 },
    { title: 'Утерянные Мемуары', author: 'Неизвестный', category: 'literature', price: 200.0, format: 'Твердый переплет', pages: 450 }
];

const archives = [
    { title: 'Проект Баухауса #42', doc_type: 'blueprints', year: 1928, description: 'Оригинальные чертежи.' },
    { title: 'Письма Модернизма', doc_type: 'manuscripts', year: 1955, description: 'Переписка кураторов.' },
    { title: 'Чертежи Ле Корбюзье', doc_type: 'blueprints', year: 1930, description: 'Эскизы Виллы Савой.' },
    { title: 'Дневники Ван дер Роэ', doc_type: 'manuscripts', year: 1948, description: 'Личные записи архитектора.' },
    { title: 'План реконструкции Парижа', doc_type: 'blueprints', year: 1853, description: 'Чертежи Османа.' },
    { title: 'Заметки о типографике', doc_type: 'manuscripts', year: 1920, description: 'Рукописи Яна Чихольда.' },
    { title: 'Эскизы Баухауса', doc_type: 'blueprints', year: 1925, description: 'Наброски мебели и интерьеров.' },
    { title: 'Переписка Фрэнка Ллойда Райта', doc_type: 'manuscripts', year: 1935, description: 'Письма к клиентам.' },
    { title: 'Схемы Нью-Йоркского метро', doc_type: 'blueprints', year: 1904, description: 'Оригинальные планы станций.' },
    { title: 'Манифест Де Стейл', doc_type: 'manuscripts', year: 1917, description: 'Первый черновик документа.' }
];

const curations = [
    { title: 'Эстетика Пустоты', category: 'minimalism', description: 'Книги, исследующие силу негативного пространства.' },
    { title: 'Золотой Век Печати', category: 'classics', description: 'Первые издания, изменившие ход истории.' },
    { title: 'Эпоха Брутализма', category: 'architecture', description: 'Исследование бетонных форм.' },
    { title: 'Эпистолярная Традиция', category: 'history', description: 'Историческая переписка из закрытых хранилищ.' },
    { title: 'Мастера Типографики', category: 'typography', description: 'Собрание лучших трудов по дизайну шрифтов.' },
    { title: 'Городские Утопии', category: 'urbanism', description: 'Проекты идеальных городов будущего.' },
    { title: 'Искусство Света', category: 'design', description: 'Влияние освещения на восприятие пространства.' },
    { title: 'Философия Формы', category: 'philosophy', description: 'Теоретические основы современного дизайна.' },
    { title: 'Архив Баухауса', category: 'history', description: 'Редкие материалы легендарной школы.' },
    { title: 'Ночные Видения', category: 'photography', description: 'Современная фотография и игра теней.' }
];

db.serialize(() => {
    // 1. Очистка старых таблиц (чтобы скрипт можно было запускать многократно без дублей)
    db.run("DROP TABLE IF EXISTS Users");
    db.run("DROP TABLE IF EXISTS Catalog");
    db.run("DROP TABLE IF EXISTS Archives");
    db.run("DROP TABLE IF EXISTS Curations");

    // 2. Создание структуры таблиц
    db.run(`CREATE TABLE Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT UNIQUE,
        role TEXT,
        interests TEXT
    )`);

    db.run(`CREATE TABLE Catalog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT,
        category TEXT,
        price REAL,
        format TEXT,
        pages INTEGER
    )`);

    db.run(`CREATE TABLE Archives (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        doc_type TEXT,
        year INTEGER,
        description TEXT
    )`);

    db.run(`CREATE TABLE Curations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        description TEXT
    )`);

    // 3. Заполнение данными (Используем подготовленные запросы для безопасности и скорости)
    const stmtUsers = db.prepare("INSERT INTO Users (first_name, last_name, email, role, interests) VALUES (?, ?, ?, ?, ?)");
    users.forEach(u => stmtUsers.run(u.first_name, u.last_name, u.email, u.role, u.interests));
    stmtUsers.finalize();

    const stmtCatalog = db.prepare("INSERT INTO Catalog (title, author, category, price, format, pages) VALUES (?, ?, ?, ?, ?, ?)");
    catalog.forEach(c => stmtCatalog.run(c.title, c.author, c.category, c.price, c.format, c.pages));
    stmtCatalog.finalize();

    const stmtArchives = db.prepare("INSERT INTO Archives (title, doc_type, year, description) VALUES (?, ?, ?, ?)");
    archives.forEach(a => stmtArchives.run(a.title, a.doc_type, a.year, a.description));
    stmtArchives.finalize();

    const stmtCurations = db.prepare("INSERT INTO Curations (title, category, description) VALUES (?, ?, ?)");
    curations.forEach(c => stmtCurations.run(c.title, c.category, c.description));
    stmtCurations.finalize();

    console.log('✅ База данных успешно пересоздана и заполнена тестовыми данными:');
    console.log(`- Пользователей: ${users.length}`);
    console.log(`- Каталог (Книги): ${catalog.length}`);
    console.log(`- Архивы: ${archives.length}`);
    console.log(`- Подборки: ${curations.length}`);
});

db.close();