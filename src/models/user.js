const query = require('../db/connection');
const bcrypt = require('bcrypt');
const { parseQueryParamsWithPlaceHolders } = require('../utils/common');

class User {
    tableName = 'users';

    create = async body => {
        body.password = bcrypt.hashSync(body.password, 8);
        const { keySet, values } = parseQueryParamsWithPlaceHolders(body, ', ');
        let sql = `INSERT INTO ${this.tableName} SET status_id = ?, ${keySet}`;

        return await query(sql, [1, ...values]);
    }

    findById = async id => {
        let sql = `SELECT u.id, r.type AS role, u.email, u.password, u.name, u.surname, u.image FROM ${this.tableName} u JOIN roles r ON u.role_id = r.id 
        WHERE u.id = ? AND u.status_id = ?`;

        return await query(sql, [id, 1]);
    }

    findByEmail = async email => {
        let sql = `SELECT u.id, r.type AS role, u.email, u.password, u.name, u.surname, u.image FROM ${this.tableName} u JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ? AND u.status_id = ?`;

        return await query(sql, [email, 1]);
    }

    authorize = async (id, email) => {
        let sql = `SELECT u.id FROM ${this.tableName} u JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ? AND u.email = ?`;

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
        let sql = `UPDATE ${this.tableName} SET status_id = ? WHERE id = ?`;

        return await query(sql, [2, id]);
    }
}

module.exports = new User;