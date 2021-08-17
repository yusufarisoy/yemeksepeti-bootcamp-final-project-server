const query = require('../db/connection');
const { parseQueryParamsWithPlaceHolders } = require('../utils/common');

class Food {
    tableName = 'foods';

    create = async (restaurantId, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `INSERT INTO ${this.tableName} SET restaurant_id = ?, ${keySet}`;

        return await query(sql, [restaurantId, ...values]);
    }

    findAll = async restaurantId => {
        let sql = `SELECT * FROM ${this.tableName} WHERE restaurant_id = ?`;

        return await query(sql, [restaurantId]);
    }

    update = async (restaurantId, id, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `UPDATE ${this.tableName} SET ${keySet} WHERE restaurant_id = ? AND id = ?`;

        return await query(sql, [...values, restaurantId, id]);
    }

    delete = async (restaurantId, id) => {
        let sql = `DELETE FROM ${this.tableName} WHERE restaurant_id = ? AND id = ?`;

        return await query(sql, [restaurantId, id]);
    }
}

module.exports = new Food;