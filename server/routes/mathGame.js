const express = require('express');
const router = express.Router();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

async function getDB() {
    return open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });
}

// 1. Математика боюнча эң мыкты 5 рекордду алуу
router.get('/leaderboard', async (req, res) => {
    try {
        const db = await getDB();
        const topScores = await db.all(
            "SELECT * FROM math_scores ORDER BY score DESC LIMIT 5"
        );
        res.json(topScores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Жаңы рекордду сактоо
router.post('/score', async (req, res) => {
    try {
        const { score } = req.body;
        const db = await getDB();
        const date = new Date().toLocaleString('ky-KG');

        await db.run(
            "INSERT INTO math_scores (score, date) VALUES (?, ?)",
            [score, date]
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;