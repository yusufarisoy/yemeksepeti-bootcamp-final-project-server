const query = require('../db/connection');
const { parseQueryParamsWithPlaceHolders } = require('../utils/common');

class Order {
    tableName = 'orders';

    create = async (userId, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `INSERT INTO ${this.tableName} SET user_id = ?, status_id = ?, ${keySet}`;

        return await query(sql, [userId, 1, ...values]);
    }

    findAllOfUser = async (userId, params) => {
        let sql = `SELECT o.id, o.user_id, CONCAT(u.name + ' ' + u.surname) AS user, o.restaurant_id, r.image AS restaurant_image, r.name AS restaurant, r.avg_point, a.id AS address_id, 
        c.name AS city, d.name AS district, a.address, p.type AS payment_type, s.type AS order_status, o.note, o.date FROM ${this.tableName} o JOIN users u ON o.user_id = u.id JOIN 
        restaurants r ON o.restaurant_id = r.id JOIN addresses a ON o.delivery_address_id = a.id JOIN districts d ON a.district_id = d.id JOIN cities c ON d.city_id = c.id 
        JOIN payment_types AS p ON o.payment_type_id = p.id JOIN order_statuses s ON o.status_id = s.id WHERE o.user_id = ?`;

        if (!Object.keys(params).length) {
            return await query(sql, [userId]);
        }

        const { keySet, values } = parseQueryParamsWithPlaceHolders(params, ' AND ');
        sql += ` AND ${keySet}`;

        return await query(sql, [userId, ...values]);
    }

    findAllOfRestaurant = async (restaurantId, params) => {
        let sql = `SELECT o.id, o.user_id, CONCAT(u.name + ' ' + u.surname) AS user, o.restaurant_id, r.image AS restaurant_image, r.name AS restaurant, r.avg_point, a.id AS address_id, 
        c.name AS city, d.name AS district, a.address, p.type AS payment_type, s.type AS order_status, o.note, o.date FROM ${this.tableName} o JOIN users u ON o.user_id = u.id JOIN 
        restaurants r ON o.restaurant_id = r.id JOIN addresses a ON o.delivery_address_id = a.id JOIN districts d ON a.district_id = d.id JOIN cities c ON d.city_id = c.id 
        JOIN payment_types AS p ON o.payment_type_id = p.id JOIN order_statuses s ON o.status_id = s.id WHERE o.restaurant_id = ?`;

        if (!Object.keys(params).length) {
            return await query(sql, [restaurantId]);
        }

        const { keySet, values } = parseQueryParamsWithPlaceHolders(params, ' AND ');
        sql += ` AND ${keySet}`;

        return await query(sql, [restaurantId, ...values]);
    }

    findById = async (id, statusId) => {
        let sql = `SELECT o.id, o.user_id, CONCAT(u.name + ' ' + u.surname) AS user, o.restaurant_id, r.image AS restaurant_image, r.name AS restaurant, r.avg_point, a.id AS address_id, 
        c.name AS city, d.name AS district, a.address, p.type AS payment_type, s.type AS order_status, o.note, o.date FROM ${this.tableName} o JOIN users u ON o.user_id = u.id JOIN 
        restaurants r ON o.restaurant_id = r.id JOIN addresses a ON o.delivery_address_id = a.id JOIN districts d ON a.district_id = d.id JOIN cities c ON d.city_id = c.id 
        JOIN payment_types AS p ON o.payment_type_id = p.id JOIN order_statuses s ON o.status_id = s.id WHERE o.id = ? AND o.status_id = ?`;

        return await query(sql, [id, statusId]);
    }

    updateStatus = async (id, statusId) => {
        let sql = `UPDATE ${this.tableName} SET status_id = ? WHERE id = ?`;

        return await query(sql, [statusId, id]);//TODO: set result_date
    }
}

module.exports = new Order;