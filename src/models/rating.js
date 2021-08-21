const query = require('../db/connection');
const { parseQueryParamsWithPlaceHolders } = require('../utils/common');

class Rating {
    tableName = 'ratings';

    create = async (userId, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `INSERT INTO ${this.tableName} SET user_id = ?, ${keySet}`;

        return await query(sql, [userId, ...values]);
    }

    findAll = async params => {
        let sql = `SELECT restaurant_id, score, review FROM ${this.tableName}`;
        
        if (!Object.keys(params).length) {
            sql += ' GROUP BY r.id';
            return await query(sql);
        }

        const { keySet, values } = parseQueryParamsWithPlaceHolders(params, ' AND ');
        sql += ` WHERE ${keySet}`;

        return await query(sql, [...values]);
    }
}

module.exports = new Rating;