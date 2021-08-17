const express = require('express');
const router = express.Router();
const CitiesController = require('../controllers/citiesController');

router.get('/', CitiesController.findAll);

module.exports = router;