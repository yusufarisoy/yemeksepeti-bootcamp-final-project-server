const Order = require('../models/order');
const Restaurant = require('../models/restaurant');
const { SuccessResponse, SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class OrdersController {

    create = async (req, res) => {
        if (res.locals.role !== 'user') {
            return res.status(401).json(new ErrorResponse('Unauthorized access.'));
        }
        await Order.create(parseInt(res.locals.id), req.body)
        .then(results => {
            res.status(200).json(new SuccessDataResponse('Order received successfully.', { order_id: results.insertId }));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findAllOfUser = async (req, res) => {
        await Order.findAllOfUser(parseInt(res.locals.id), req.query)
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Orders of user listed successfully.', results));
            } else {
                res.status(200).json(new ErrorResponse('No order found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findAllOfRestaurant = async (req, res) => {
        await Order.findAllOfRestaurant(parseInt(res.locals.id), parseInt(req.params.restaurant_id), req.query)
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Orders of restaurant listed successfully.', results));
            } else {
                res.status(200).json(new ErrorResponse('No order found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    updateStatus = async (req, res) => {
        await Restaurant.findById(parseInt(req.params.restaurant_id))
        .then(async results => {
            if (results.length > 0) {
                if (parseInt(res.locals.id) !== results[0].owner_id) {
                    res.status(401).json(new ErrorResponse('Unauthorized access.'));
                } else {
                    await Order.updateStatus(parseInt(req.params.id), req.body.status_id)
                    .then(subResults => {
                        if (subResults.affectedRows > 0) {
                            res.status(200).json(new SuccessResponse('Order status updated successfully.'));
                        } else {
                            res.status(200).json(new ErrorResponse('Order status update failed.'));
                        }
                    }, () => {
                        res.status(500).json(new ErrorResponse('Internal server error.'));
                    });
                }
            } else {
                res.status(200).json(new ErrorResponse('Restaurant not found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new OrdersController;