const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

async function getDB() {
    return open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });
}

module.exports = { getDB };