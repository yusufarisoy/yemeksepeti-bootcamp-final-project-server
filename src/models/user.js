const query = require('../db/connection');
const bcrypt = require('bcrypt');
const { parseQueryParamsWithPlaceHolders } = require('../utils/common');

class User {
    tableName = 'users';

    create = async body => {
        body.password = bcrypt.hashSync(body.password, 8);
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `INSERT INTO ${this.tableName} SET status_id = 1, ${keySet}`;

        return await query(sql, [...values]);
    }

    findById = async id => {
        let sql = `SELECT u.id, r.type AS role, c.id AS city_id, u.email, u.password, u.name, u.surname, u.image, u.phone_number FROM ${this.tableName} u 
        JOIN roles r ON r.id = u.role_id LEFT JOIN addresses a ON a.user_id = u.id LEFT JOIN districts d ON d.id = a.district_id LEFT JOIN cities c ON c.id = d.city_id 
        WHERE u.id = ? AND u.status_id = 1`;

        return await query(sql, [id]);
    }

    findByEmail = async email => {
        let sql = `SELECT u.id, r.type AS role, u.email, u.password, u.name, u.surname, u.image FROM ${this.tableName} u JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ? AND u.status_id = 1`;

        return await query(sql, [email]);
    }

    authorize = async (id, email) => {
        let sql = `SELECT id FROM ${this.tableName} WHERE id = ? AND email = ?`;

        return await query(sql, [id, email]);
    }

    update = async (id, body) => {
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `UPDATE ${this.tableName} SET ${keySet} WHERE id = ?`;

        return await query(sql, [...values, id]);
    }

    changePassword = async (id, newPassword) => {
        let sql = `UPDATE ${this.tableName} SET password = ? WHERE id = ?`;

        return await query(sql, [newPassword, id]);
    }

    delete = async id => {
        let sql = `UPDATE ${this.tableName} SET status_id = 2 WHERE id = ?`;

        return await query(sql, [id]);
    }
}

module.exports = new User;