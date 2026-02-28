const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function getDb() {
    return open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });
}

// Упайды сактоо
router.post('/score', async (req, res) => {
    const { username, score, rank, date } = req.body;
    try {
        const db = await getDb();
        await db.run(
            'INSERT INTO word_game_scores (username, score, rank, date) VALUES (?, ?, ?, ?)',
            [username || 'Аноним', score, rank, date]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;