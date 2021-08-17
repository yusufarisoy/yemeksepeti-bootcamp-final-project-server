const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

class Database {
    constructor() {
        this.db = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE_NAME,
            port: process.env.DATABASE_CONNECTION_PORT
        });
        this.db.connect();
    }

    query = async (sql, values) => {
        return new Promise((resolve, reject) => {
            this.db.query(sql, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        }).catch(error => {
            throw error;
        });
    }
}

module.exports = new Database().query;