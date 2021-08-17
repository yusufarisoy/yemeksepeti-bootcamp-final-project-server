const query = require('../db/connection');
const { parseQueryParamsWithPlaceHolders } = require('../utils/common');

class Address {
    tableName = 'addresses';

    create = async (userId, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `INSERT INTO ${this.tableName} SET user_id = ?, ${keySet}`;

        return await query(sql, [userId, ...values]);
    }

    findAll = async userId => {
        let sql = `SELECT a.id, a.user_id, c.name AS city, d.name AS district, a.title, a.address, a.last_update_date FROM ${this.tableName} a 
        JOIN districts d ON a.district_id = d.id JOIN cities c ON d.city_id = c.id WHERE a.user_id = ?`;

        return await query(sql, [userId]);
    }

    findById = async (userId, id) => {
        let sql = `SELECT a.id, a.user_id, c.name AS city, d.name AS district, a.title, a.address, a.last_update_date FROM ${this.tableName} a 
        JOIN districts d ON a.district_id = d.id JOIN cities c ON d.city_id = c.id WHERE a.user_id = ? AND a.id = ?`;

        return await query(sql, [userId, id]);
    }

    update = async (id, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `UPDATE ${this.tableName} SET ${keySet} WHERE id = ?`;

        return await query(sql, [...values, id]);//TODO: Set last_update_date
    }

    delete = async id => {
        let sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

        return await query(sql, [id]);
    }
}

module.exports = new Address;