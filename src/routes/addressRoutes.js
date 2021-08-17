const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorization');
const AddressesController = require('../controllers/addressesController');

router.get('/', authorize(), AddressesController.findAll);
router.get('/:id', authorize(), AddressesController.findById);

router.post('/new', authorize(), AddressesController.create);

router.put('/:id/update', authorize(), AddressesController.update);

router.delete('/:id/delete', authorize(), AddressesController.delete);

module.exports = router;