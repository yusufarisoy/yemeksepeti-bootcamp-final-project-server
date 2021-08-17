const query = require('../db/connection');

class PaymentType {
    tableName = 'payment_types';

    findAll = async () => {
        let sql = `SELECT * FROM ${this.tableName}`;
        return await query(sql);
    }
}

module.exports = new PaymentType;