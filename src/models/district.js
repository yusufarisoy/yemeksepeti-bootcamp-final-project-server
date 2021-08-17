const query = require('../db/connection');

class District {
    tableName = 'districts';

    findAll = async () => {
        let sql = `SELECT * FROM ${this.tableName}`;
        return await query(sql);
    }
}

module.exports = new District;