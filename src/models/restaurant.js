const query = require('../db/connection');
const { parseQueryParamsWithPlaceHolders } = require('../utils/common');

class Restaurant {
    tableName = 'restaurants';

    create = async (ownerId, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `INSERT INTO ${this.tableName} SET owner_id = ?, status_id = ?, ${keySet}`;

        return await query(sql, [ownerId, 1, ...values]);
    }

    findAll = async params => {
        let sql = `SELECT r.id, c.name AS city, d.name AS district, r.image, r.name, r.min_order_fee, r.avg_delivery_time, r.avg_point 
        FROM ${this.tableName} r JOIN cities c ON r.city_id = c.id JOIN districts d ON r.district_id = d.id`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { keySet, values } = parseQueryParamsWithPlaceHolders(params, ' AND ');
        sql += ` WHERE ${keySet}`;

        return await query(sql, [...values]);
    }

    findById = async id => {
        let sql = `SELECT r.id, r.owner_id, c.name AS city, d.name AS district, r.image, r.name, r.min_order_fee, r.avg_delivery_time, r.avg_point 
        FROM ${this.tableName} r JOIN cities c ON r.city_id = c.id JOIN districts d ON r.district_id = d.id WHERE r.id = ? AND r.status_id = ?`;

        return await query(sql, [id, 1]);
    }

    update = async (id, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `UPDATE ${this.tableName} SET ${keySet} WHERE id = ?`;

        return await query(sql, [...values, id]);
    }

    delete = async id => {
        let sql = `UPDATE ${this.tableName} SET status_id = ? WHERE id = ?`;

        return await query(sql, [3, id]);
    }
}

module.exports = new Restaurant;