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
        let sql = `SELECT o.id, o.restaurant_id, r.image AS restaurant_image, r.name AS restaurant, c.name AS city, d.name AS district, 
        a.address AS delivery_address, p.type AS payment_type, s.type AS order_status, o.note, o.date, SUM(orf.quantity * f.price) AS total_price 
        FROM ${this.tableName} o JOIN restaurants r ON o.restaurant_id = r.id JOIN addresses a ON o.delivery_address_id = a.id JOIN districts d 
        ON a.district_id = d.id JOIN cities c ON d.city_id = c.id JOIN payment_types AS p ON o.payment_type_id = p.id JOIN order_statuses s 
        ON o.status_id = s.id JOIN order_food orf ON o.id = orf.order_id JOIN foods f ON orf.food_id = f.id WHERE o.user_id = ?`;

        if (!Object.keys(params).length) {
            sql += ' GROUP BY o.id ORDER BY o.id DESC';
            return await query(sql, [userId]);
        }

        const { keySet, values } = parseQueryParamsWithPlaceHolders(params, ' AND ');
        sql += ` AND ${keySet}`;
        sql += ' GROUP BY o.id ORDER BY o.id DESC';

        return await query(sql, [userId, ...values]);
    }

    findAllOfRestaurant = async (restaurantOwnerId, restaurantId, params) => {
        let sql = `SELECT o.id, CONCAT(u.name, ' ', u.surname) AS user, c.name AS city, d.name AS district, a.address AS delivery_address, 
        p.type AS payment_type, s.type AS order_status, o.note, o.date, SUM(orf.quantity * f.price) AS total_price FROM ${this.tableName} o JOIN users u 
        ON o.user_id = u.id JOIN addresses a ON o.delivery_address_id = a.id JOIN districts d ON a.district_id = d.id JOIN cities c ON d.city_id = c.id JOIN 
        payment_types AS p ON o.payment_type_id = p.id JOIN order_statuses s ON o.status_id = s.id JOIN order_food orf ON o.id = orf.order_id JOIN foods f ON 
        orf.food_id = f.id JOIN restaurants r ON r.id = o.restaurant_id WHERE r.owner_id = ? AND o.restaurant_id = ?`;

        if (!Object.keys(params).length) {
            sql += ' GROUP BY o.id ORDER BY o.id DESC';
            return await query(sql, [restaurantOwnerId, restaurantId]);
        }

        const { keySet, values } = parseQueryParamsWithPlaceHolders(params, ' AND ');
        sql += ` AND ${keySet}`;
        sql += ' GROUP BY o.id ORDER BY o.id DESC';

        return await query(sql, [restaurantOwnerId, restaurantId, ...values]);
    }

    updateStatus = async (id, statusId) => {
        let sql = `UPDATE ${this.tableName} SET status_id = ? WHERE id = ?`;

        return await query(sql, [statusId, id]);//TODO: set result_date
    }
}

module.exports = new Order;