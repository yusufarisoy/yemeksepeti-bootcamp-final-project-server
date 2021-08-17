const query = require('../db/connection');
const { parseQueryParamsWithPlaceHolders } = require('../utils/common');

class Rating {
    tableName = 'ratings';

    create = async (userId, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `INSERT INTO ${this.tableName} SET user_id = ?, ${keySet}`;

        return await query(sql, [userId, ...values]);
    }

    findAll = async restaurantId => {
        let sql = `SELECT restaurant_id, score, review FROM ${this.tableName} WHERE restaurant_id = ?`;

        return await query(sql, [restaurantId]);
    }
}

module.exports = new Rating;