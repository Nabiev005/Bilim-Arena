const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

// Базага туташуу функциясы (Async/Await менен ишенимдүүрөөк)
async function getDb() {
    if (!db) {
        db = await open({
            filename: path.join(__dirname, '../database.sqlite'),
            driver: sqlite3.Database
        });
    }
    return db;
}

// 1. Упайды сактоо: POST /api/ort/save-result
router.post('/save-result', async (req, res) => {
    const { username, subject, score, total } = req.body;
    // Кыргызстандын убактысы менен форматтоо
    const date = new Date().toISOString(); 

    try {
        const database = await getDb();
        await database.run(
            `INSERT INTO ort_scores (username, subject, score, total, date) VALUES (?, ?, ?, ?, ?)`,
            [username || 'Аноним', subject, score, total, date]
        );
        res.json({ success: true, message: "Жыйынтык сакталды!" });
    } catch (error) {
        console.error("Save error:", error);
        res.status(500).json({ success: false, error: "Базага жазууда ката кетти" });
    }
});

// 2. Рейтингди алуу: GET /api/ort/leaderboard
// Бул жерде "Баары" же конкреттүү бир предмет боюнча маалымат алса болот
router.get('/leaderboard', async (req, res) => {
    const { subject } = req.query; // Фильтрация үчүн (мисалы: ?subject=Математика)

    try {
        const database = await getDb();
        let query = `SELECT * FROM ort_scores`;
        let params = [];

        if (subject && subject !== 'Баары') {
            query += ` WHERE subject = ?`;
            params.push(subject);
        }

        // Упай боюнча эң чоңунан баштап тизүү, упай тең болсо датасына карайт
        query += ` ORDER BY score DESC, date DESC LIMIT 50`;

        const scores = await database.all(query, params);
        res.json({ success: true, data: scores });
    } catch (error) {
        console.error("Leaderboard error:", error);
        res.status(500).json({ success: false, error: "Рейтингди алууда ката кетти" });
    }
});

// 3. Өзүнүн упайларын гана көрүү (Кошумча функция катары)
router.get('/my-scores/:username', async (req, res) => {
    try {
        const database = await getDb();
        const { username } = req.params;
        const myScores = await database.all(
            `SELECT * FROM ort_scores WHERE username = ? ORDER BY date DESC`,
            [username]
        );
        res.json({ success: true, data: myScores });
    } catch (error) {
        res.status(500).json({ success: false, error: "Маалымат алууда ката кетти" });
    }
});

module.exports = router;