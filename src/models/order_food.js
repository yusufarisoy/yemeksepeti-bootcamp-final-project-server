const query = require('../db/connection');

class Order_Food {
    tableName = 'order_food';

    create = async foodList => {
        let sql = `INSERT INTO ${this.tableName} (order_id, food_id, quantity, removed_ingredients) VALUES ?`;

        return await query(sql, [foodList]);
    }

    findAll = async orderId => {
        let sql = `SELECT orf.id, orf.order_id, orf.food_id, f.name AS food, f.price, orf.quantity, orf.removed_ingredients 
        FROM ${this.tableName} orf JOIN foods f ON orf.food_id = f.id WHERE orf.order_id = ?`;

        return await query(sql, [orderId]);
    }
}

module.exports = new Order_Food;