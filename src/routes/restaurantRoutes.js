const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorization');
const FoodsController = require('../controllers/foodsController');
const OrdersController = require('../controllers/ordersController');
const RestaurantsController = require('../controllers/restaurantsController');

router.get('/', RestaurantsController.findAll);
router.get('/:id', RestaurantsController.findById);
router.get('/most-populars/:city_id', RestaurantsController.findMostPopulars);
router.get('/:restaurant_id/orders', authorize(), OrdersController.findAllOfRestaurant);

router.post('/new', authorize(), RestaurantsController.create);

router.put('/:id/update', authorize(), RestaurantsController.update);

router.delete('/:id/delete', authorize(), RestaurantsController.delete);

//Food
router.get('/:restaurant_id/foods', FoodsController.findAll);

router.post('/:restaurant_id/foods/new', authorize(), FoodsController.create);

router.put('/:restaurant_id/foods/:id/update', authorize(), FoodsController.update);

router.delete('/:restaurant_id/foods/:id/delete', authorize(), FoodsController.delete);

module.exports = router;