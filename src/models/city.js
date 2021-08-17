const query = require('../db/connection');

class City {
    tableName = 'cities';

    findAll = async () => {
        let sql = `SELECT * FROM ${this.tableName}`;
        return await query(sql);
    }
}

module.exports = new City;