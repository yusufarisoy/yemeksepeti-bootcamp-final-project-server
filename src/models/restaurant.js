const query = require('../db/connection');
const { parseQueryParamsWithPlaceHolders } = require('../utils/common');

class Restaurant {
    tableName = 'restaurants';

    create = async (ownerId, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `INSERT INTO ${this.tableName} SET owner_id = ?, status_id = 1, ${keySet}`;

        return await query(sql, [ownerId, ...values]);
    }

    findAll = async params => {
        let sql = `SELECT r.id, r.city_id, c.name AS city, r.district_id, d.name AS district, r.image, r.banner_image, r.name, r.phone_number, r.min_order_fee, r.avg_delivery_time, AVG(ra.score) AS rating 
        FROM ${this.tableName} r JOIN cities c ON r.city_id = c.id JOIN districts d ON r.district_id = d.id JOIN ratings ra ON ra.restaurant_id = r.id`;

        if (!Object.keys(params).length) {
            sql += ' GROUP BY r.id';
            return await query(sql);
        }

        const { keySet, values } = parseQueryParamsWithPlaceHolders(params, ' AND ');
        sql += ` WHERE ${keySet}`;
        sql += ' GROUP BY r.id';

        return await query(sql, [...values]);
    }

    findMostPopulars = async cityId => {
        let sql = `SELECT r.id, c.name AS city, d.name AS district, r.image, r.banner_image, r.name, r.min_order_fee, r.avg_delivery_time, AVG(ra.score) AS rating 
        FROM ${this.tableName} r JOIN cities c ON r.city_id = c.id JOIN districts d ON r.district_id = d.id JOIN ratings ra ON ra.restaurant_id = r.id WHERE 
        r.city_id = ${cityId} AND r.status_id = 1 GROUP BY r.id`;

        return await query(sql);
    }

    findById = async id => {
        let sql = `SELECT r.id, r.owner_id, c.name AS city, d.name AS district, r.image, r.banner_image, r.name, r.min_order_fee, r.avg_delivery_time, AVG(ra.score) AS rating 
        FROM ${this.tableName} r JOIN cities c ON r.city_id = c.id JOIN districts d ON r.district_id = d.id JOIN ratings ra ON ra.restaurant_id = r.id 
        WHERE r.id = ? AND r.status_id = 1 GROUP BY r.id`;

        return await query(sql, [id]);
    }

    update = async (ownerId, id, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `UPDATE ${this.tableName} SET ${keySet} WHERE owner_id = ? AND id = ?`;

        return await query(sql, [...values, ownerId, id]);
    }

    delete = async (ownerId, id) => {
        let sql = `UPDATE ${this.tableName} SET status_id = 3 WHERE owner_id = ? AND id = ?`;

        return await query(sql, [ownerId, id]);
    }
}

module.exports = new Restaurant;