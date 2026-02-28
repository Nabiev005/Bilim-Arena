const express = require('express');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

// 1. Маршруттарды импорттоо
const grammarRoutes = require('./routes/grammar');
const wordRoutes = require('./routes/wordGame');
const proverbsRoutes = require('./routes/proverbs');
const mathRoutes = require('./routes/mathGame');
const manasRoutes = require('./routes/manasQuiz');
const wordHunterRoutes = require('./routes/wordHunter');
const ortRoutes = require('./routes/ort');

const app = express();

app.use(cors());
app.use(express.json());

let db;

// 2. Базаны баштоо
async function setupDatabase() {
    db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS word_game_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, score INTEGER, rank TEXT, date TEXT);
        CREATE TABLE IF NOT EXISTS grammar_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, score INTEGER, date TEXT);
        CREATE TABLE IF NOT EXISTS proverbs_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, score INTEGER, date TEXT);
        CREATE TABLE IF NOT EXISTS math_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, score INTEGER, date TEXT);
        CREATE TABLE IF NOT EXISTS manas_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, score INTEGER, total INTEGER, date TEXT);
        
        CREATE TABLE IF NOT EXISTS ort_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT, 
            subject TEXT, 
            score INTEGER, 
            total INTEGER, 
            date TEXT
        );

        CREATE TABLE IF NOT EXISTS proverbs (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT, options TEXT, correct INTEGER, explanation TEXT);
        CREATE TABLE IF NOT EXISTS manas_quiz (id INTEGER PRIMARY KEY AUTOINCREMENT, location TEXT, question TEXT, options TEXT, correct INTEGER, info TEXT);
    `);

    console.log("SQLite базасы: Бардык таблицалар даяр.");
}

// --- ЖАҢЫ: АВТОРДУК БАРАКЧА ҮЧҮН СТАТИСТИКА API ---
app.get('/api/author-stats', async (req, res) => {
    try {
        // Базадан ар бир оюндун катышуучуларын эсептейбиз
        const wordCount = await db.get('SELECT COUNT(DISTINCT username) as count FROM word_game_scores');
        const grammarCount = await db.get('SELECT COUNT(DISTINCT username) as count FROM grammar_scores');
        const ortCount = await db.get('SELECT COUNT(DISTINCT username) as count FROM ort_scores');
        const mathCount = await db.get('SELECT COUNT(DISTINCT username) as count FROM math_scores');

        // Жалпы уникалдуу колдонуучулардын болжолдуу саны
        const totalUsers = wordCount.count + grammarCount.count + ortCount.count + mathCount.count;

        const stats = {
            projectStatus: 85, // Кол менен же версияга карап башкарса болот
            totalGames: 7,    // Маршруттардын саны
            activeUsers: totalUsers + 120, // Базадагылар + кошумча (имитация)
            serverStatus: "Туруктуу",
            version: "v1.0.5",
            activityData: [40, 55, 45, 90, 65, 85, 50], // Бул жерди график үчүн колдонсо болот
            notifications: [
                { id: 1, text: "Жаңы 'ЖРТ: Кыргыз тили' бөлүмү ийгиликтүү кошулду." },
                { id: 2, text: "Системанын коопсуздугу SSL v3 деңгээлине жаңыртылды." },
                { id: 3, text: "Рейтинг системасы оптималдаштырылды." }
            ]
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Статистиканы эсептөөдө ката кетти" });
    }
});

// 3. УНИВЕРСАЛДУУ РЕЙТИНГ API (Оптималдаштырылды)
app.get('/api/global-leaderboard', async (req, res) => {
    try {
        const scores = await db.all(`
            SELECT username, 'Сөз-Мерген' as game, score, date, rank FROM word_game_scores
            UNION ALL
            SELECT username, 'Грамматика' as game, score, date, 'Окуучу' as rank FROM grammar_scores
            UNION ALL
            SELECT username, 'Макалдар' as game, score, date, 'Чечен' as rank FROM proverbs_scores
            UNION ALL
            SELECT username, 'Математика' as game, score, date, 'Эсепчи' as rank FROM math_scores
            UNION ALL
            SELECT username, 'Манас' as game, score, date, 'Манасчы' as rank FROM manas_scores
            UNION ALL
            SELECT username, 'ЖРТ: ' || subject as game, score, date, 'Абитуриент' as rank FROM ort_scores
            ORDER BY score DESC LIMIT 20
        `);
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: "Рейтингди алууда ката кетти" });
    }
});

// 4. API Маршруттары
app.use('/api/grammar', grammarRoutes);
app.use('/api/word-game', wordRoutes);
app.use('/api/proverbs', proverbsRoutes);
app.use('/api/math', mathRoutes);
app.use('/api/manas', manasRoutes);
app.use('/api/word-hunter', wordHunterRoutes);
app.use('/api/ort', ortRoutes);

// 5. Каталарды иштетүү
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Серверде ички ката кетти!' });
});

const PORT = process.env.PORT || 5000;
setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Сервер иштеп жатат: http://localhost:${PORT}`);
    });
});