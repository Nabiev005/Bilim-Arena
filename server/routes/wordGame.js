const express = require('express');
const router = express.Router();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

// Базага туташуу функциясы
async function getDB() {
    return open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });
}

// 1. Лидербордду алуу (Эң жогорку 5 упай)
router.get('/leaderboard', async (req, res) => {
    try {
        const db = await getDB();
        const scores = await db.all(
            "SELECT * FROM word_game_scores ORDER BY score DESC LIMIT 5"
        );
        res.json(scores);
    } catch (error) {
        console.error("Лидербордду алууда ката:", error);
        res.status(500).json({ error: "Серверде ката кетти" });
    }
});

// 2. Жаңы упайды сактоо
router.post('/score', async (req, res) => {
    try {
        const { score, rank } = req.body;
        const db = await getDB();
        const date = new Date().toLocaleString('ky-KG');

        await db.run(
            "INSERT INTO word_game_scores (score, rank, date) VALUES (?, ?, ?)",
            [score, rank, date]
        );

        res.json({ success: true, message: "Упай сакталды!" });
    } catch (error) {
        console.error("Упай сактоодо ката:", error);
        res.status(500).json({ error: "Маалымат сакталган жок" });
    }
});

module.exports = router;