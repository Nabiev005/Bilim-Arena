const express = require('express');
const router = express.Router();
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

// Базага туташуу функциясы (ар бир суроодо чакырылат)
async function getDB() {
    return open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });
}

//  Бардык грамматика суроолорун алуу
router.get('/questions', async (req, res) => {
    try {
        const db = await getDB();
        const questions = await db.all("SELECT * FROM grammar_questions");
        
        // Маалымат базасында options ТЕКСТ (string) катары сакталат, 
        // аны кайра Массивге (array) айландырып жөнөтөбүз.
        const formattedQuestions = questions.map(q => ({
            ...q,
            options: JSON.parse(q.options)
        }));
        
        res.json(formattedQuestions);
    } catch (error) {
        console.error("Суроолорду алууда ката:", error);
        res.status(500).json({ error: "Серверде ката кетти" });
    }
});

//  Грамматика оюнунун упайын сактоо
router.post('/score', async (req, res) => {
    try {
        const { score } = req.body;
        const db = await getDB();
        const date = new Date().toLocaleString('ky-KG');

        await db.run(
            "INSERT INTO grammar_scores (score, date) VALUES (?, ?)",
            [score, date]
        );

        res.json({ success: true, message: "Упай ийгиликтүү сакталды" });
    } catch (error) {
        console.error("Упай сактоодо ката:", error);
        res.status(500).json({ error: "Упай сакталган жок" });
    }
});

//  Лидерборд (Эң жогорку упайларды алуу - кааласаңыз)
router.get('/leaderboard', async (req, res) => {
    try {
        const db = await getDB();
        const scores = await db.all("SELECT * FROM grammar_scores ORDER BY score DESC LIMIT 10");
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;