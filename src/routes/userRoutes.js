const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorization');
const UsersController = require('../controllers/usersController');
const OrdersController = require('../controllers/ordersController');

router.get('/:id', UsersController.findById);
router.get('/:user_id/orders', authorize(), OrdersController.findAllOfUser);
router.get('/:user_id/orders/:id', authorize(), OrdersController.findByIdOfUser);

router.post('/login', UsersController.login);
router.post('/register', UsersController.create)

router.put('/:id/update', authorize(), UsersController.update);
router.put('/:id/change-password', authorize(), UsersController.changePassword);

router.delete('/:id/delete', authorize(), UsersController.delete);

module.exports = router;