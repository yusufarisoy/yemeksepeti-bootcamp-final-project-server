const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorization');
const RatingsController = require('../controllers/ratingsController');

router.get('/', RatingsController.findAll);

router.post('/new', authorize(), RatingsController.create);

module.exports = router;