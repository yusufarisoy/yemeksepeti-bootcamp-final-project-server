const Restaurant = require('../models/restaurant');
const { SuccessResponse, SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class RestaurantsController {

    create = async (req, res) => {
        if (res.locals.role !== 'owner') {
            return res.status(401).json(new ErrorResponse('Unauthorized access.'));
        }
        await Restaurant.create(parseInt(res.locals.id), req.body)
        .then(() => {
            res.status(200).json(new SuccessResponse('Restaurant created successfully.'));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findAll = async (req, res) => {
        await Restaurant.findAll(req.query)
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Restaurants listed successfully.', results));
            } else {
                res.status(200).json(new ErrorResponse('No restaurant found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findMostPopulars = async (req, res) => {
        await Restaurant.findMostPopulars(req.query)
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Most popular restaurants listed successfully.', results));
            } else {
                res.status(200).json(new ErrorResponse('No restaurant found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findById = async (req, res) => {
        await Restaurant.findById(parseInt(req.params.id))
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Restaurant listed successfully.', results[0]));
            } else {
                res.status(200).json(new ErrorResponse('Restaurant not found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    update = async (req, res) => {
        if (res.locals.role !== 'owner') {
            return res.status(401).json(new ErrorResponse('Unauthorized access.'));
        }
        await Restaurant.update(parseInt(res.locals.id), parseInt(req.params.id), req.body)
        .then(results => {
            if (results.affectedRows > 0) {
                res.status(200).json(new SuccessResponse('Restaurant information updated successfully.'));
            } else {
                res.status(200).json(new ErrorResponse('Information update failed.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    delete = async (req, res) => {
        if (res.locals.role !== 'owner') {
            return res.status(401).json(new ErrorResponse('Unauthorized access.'));
        }
        await Restaurant.delete(parseInt(res.locals.id), parseInt(req.params.id))
        .then(results => {
            if (results.affectedRows > 0) {
                res.status(200).json(new SuccessResponse('Restaurant has been deleted successfully.'));
            } else {
                res.status(200).json(new ErrorResponse('Restaurant delete failed.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new RestaurantsController;