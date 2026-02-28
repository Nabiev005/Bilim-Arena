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

// 1. Бардык суроолорду алуу
router.get('/questions', async (req, res) => {
    try {
        const db = await getDB();
        const questions = await db.all("SELECT * FROM manas_quiz");
        
        // options текстин кайра массивге (JSON.parse) айлантуу
        const formatted = questions.map(q => ({
            ...q,
            options: JSON.parse(q.options)
        }));
        
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Оюндун жыйынтыгын сактоо
router.post('/score', async (req, res) => {
    try {
        const { score, total } = req.body;
        const db = await getDB();
        const date = new Date().toLocaleString('ky-KG');

        await db.run(
            "INSERT INTO manas_scores (score, total, date) VALUES (?, ?, ?)",
            [score, total, date]
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;