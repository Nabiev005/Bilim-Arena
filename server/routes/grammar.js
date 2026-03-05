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

// 1. БАРДЫК СУРООЛОРДУ АЛУУ (GET)
router.get('/questions', async (req, res) => {
    try {
        const db = await getDB();
        const questions = await db.all("SELECT * FROM grammar_questions");
        
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

// 2. ЖАҢЫ СУРОО КОШУУ (POST) - Админ үчүн
router.post('/add-question', async (req, res) => {
    try {
        const { question, options, correct_option } = req.body;
        
        // Маалыматтардын толуктугун текшерүү
        if (!question || !options || correct_option === undefined) {
            return res.status(400).json({ error: "Бардык талааларды толтуруңуз" });
        }

        const db = await getDB();
        // options массивин базага ТЕКСТ катары сактоо үчүн JSON.stringify колдонобуз
        await db.run(
            "INSERT INTO grammar_questions (question, options, correct_option) VALUES (?, ?, ?)",
            [question, JSON.stringify(options), correct_option]
        );

        res.json({ success: true, message: "Суроо ийгиликтүү кошулду!" });
    } catch (error) {
        console.error("Суроо кошууда ката:", error);
        res.status(500).json({ error: "Базага кошууда ката кетти" });
    }
});

// 3. СУРООНУ ӨЧҮРҮҮ (DELETE) - Админ үчүн
router.delete('/delete-question/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDB();
        
        const result = await db.run("DELETE FROM grammar_questions WHERE id = ?", id);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: "Мындай ID менен суроо табылган жок" });
        }

        res.json({ success: true, message: "Суроо өчүрүлдү" });
    } catch (error) {
        res.status(500).json({ error: "Өчүрүүдө ката кетти" });
    }
});

// 4. СУРООНУ ӨЗГӨРТҮҮ (PUT) - Админ үчүн
router.put('/update-question/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { question, options, correct_option } = req.body;
        const db = await getDB();

        await db.run(
            "UPDATE grammar_questions SET question = ?, options = ?, correct_option = ? WHERE id = ?",
            [question, JSON.stringify(options), correct_option, id]
        );

        res.json({ success: true, message: "Суроо жаңыртылды" });
    } catch (error) {
        res.status(500).json({ error: "Жаңыртууда ката кетти" });
    }
});

// 5. УПАЙ САКТОО (POST)
router.post('/score', async (req, res) => {
    try {
        const { score, username } = req.body; // username кошулса жакшы болот
        const db = await getDB();
        const date = new Date().toLocaleString('ky-KG');

        await db.run(
            "INSERT INTO grammar_scores (score, date) VALUES (?, ?)",
            [score, date]
        );

        res.json({ success: true, message: "Упай ийгиликтүү сакталды" });
    } catch (error) {
        res.status(500).json({ error: "Упай сакталган жок" });
    }
});

// 6. ЛИДЕРБОРД (GET)
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