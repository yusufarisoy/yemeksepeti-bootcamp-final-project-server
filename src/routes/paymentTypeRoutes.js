const express = require('express');
const router = express.Router();
const PaymentTypesController = require('../controllers/paymentTypesController');

router.get('/', PaymentTypesController.findAll);

module.exports = router;