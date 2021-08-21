const query = require('../db/connection');

class District {
    tableName = 'districts';

    findAll = async cityId => {
        let sql = `SELECT * FROM ${this.tableName} WHERE city_id = ?`;
        return await query(sql, [cityId]);
    }
}

module.exports = new District;