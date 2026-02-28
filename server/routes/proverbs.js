const express = require('express');
const router = express.Router();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

// Маалымат базасына туташуу функциясы
async function getDB() {
    return open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });
}

/**
 * 1. Бардык макалдарды алуу (GET)
 * Дареги: http://localhost:5000/api/proverbs/data
 */
router.get('/data', async (req, res) => {
    try {
        const db = await getDB();
        const proverbs = await db.all("SELECT * FROM proverbs");

        // Базада 'options' тексти JSON форматта сакталгандыктан, 
        // аны кайра Массивге айландырып жөнөтөбүз.
        const formattedData = proverbs.map(item => ({
            ...item,
            options: JSON.parse(item.options)
        }));

        res.json(formattedData);
    } catch (error) {
        console.error("Макалдарды алууда ката:", error);
        res.status(500).json({ error: "Маалыматтарды жүктөө мүмкүн болгон жок" });
    }
});

/**
 * 2. Оюндун упайын сактоо (POST)
 * Дареги: http://localhost:5000/api/proverbs/score
 */
router.post('/score', async (req, res) => {
    try {
        const { score } = req.body;
        const db = await getDB();
        const date = new Date().toLocaleString('ky-KG');

        await db.run(
            "INSERT INTO proverbs_scores (score, date) VALUES (?, ?)",
            [score, date]
        );

        res.json({ success: true, message: "Упай сакталды" });
    } catch (error) {
        console.error("Упай сактоодо ката:", error);
        res.status(500).json({ error: "Упай сакталган жок" });
    }
});

module.exports = router;