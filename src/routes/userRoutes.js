const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorization');
const UsersController = require('../controllers/usersController');
const OrdersController = require('../controllers/ordersController');
const AddressesController = require('../controllers/addressesController');

router.get('/profile', authorize(), UsersController.findById);
router.get('/profile/orders', authorize(), OrdersController.findAllOfUser);
router.get('/profile/addresses', authorize(), AddressesController.findAll);

router.post('/login', UsersController.login);
router.post('/register', UsersController.create)
router.post('/profile/addresses/new', authorize(), AddressesController.create);

router.put('/profile/update', authorize(), UsersController.update);
router.put('/profile/change-password', authorize(), UsersController.changePassword);
router.put('/profile/addresses/:id/update', authorize(), AddressesController.update);

router.delete('/profile/delete', authorize(), UsersController.delete);
router.delete('/profile/addresses/:id/delete', authorize(), AddressesController.delete);

module.exports = router;