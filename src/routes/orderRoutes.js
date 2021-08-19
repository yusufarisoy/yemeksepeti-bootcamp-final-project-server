const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorization');
const OrdersController = require('../controllers/ordersController');
const Order_FoodController = require('../controllers/order_foodController');

router.get('/:id/foods', authorize(), Order_FoodController.findAll);

router.post('/:id/foods/add', authorize(), Order_FoodController.create);
router.post('/new', authorize(), OrdersController.create);

router.put('/:id/update', authorize(), OrdersController.updateStatus);

module.exports = router;