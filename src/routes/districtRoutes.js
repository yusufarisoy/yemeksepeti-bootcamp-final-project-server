const express = require('express');
const router = express.Router();
const DistrictsController = require('../controllers/districtsController');

router.get('/', DistrictsController.findAll);

module.exports = router;