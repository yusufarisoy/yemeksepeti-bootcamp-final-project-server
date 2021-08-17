const Order = require('../models/order');
const Restaurant = require('../models/restaurant');
const { SuccessResponse, SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class OrdersController {

    create = async (req, res) => {
        if (res.locals.role !== 'user') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Order.create(parseInt(res.locals.id), req.body)
        .then(() => {
            res.status(200).json(new SuccessResponse('Order received successfully.'));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findAllOfUser = async (req, res) => {
        if (res.locals.id !== req.params.user_id) {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Order.findAllOfUser(parseInt(req.params.user_id), req.query)
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
        if (res.locals.role !== 'owner') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Restaurant.findById(parseInt(req.params.restaurant_id))
        .then(async results => {
            if (results.length > 0) {
                if (parseInt(res.locals.id) !== results[0].owner_id) {
                    res.status(401).json(new ErrorResponse('Unauthorized access.'));
                    return;
                } else {
                    await Order.findAllOfRestaurant(parseInt(req.params.restaurant_id), req.body)
                    .then(subResults => {
                        if (subResults.length > 0) {
                            res.status(200).json(new SuccessDataResponse('Orders of restaurant listed successfully.', subResults));
                        } else {
                            res.status(200).json(new ErrorResponse('No order found.'));
                        }
                    }, () => {
                        res.status(500).json(new ErrorResponse('Internal server error.'));
                    });
                }
            } else {
                res.status(200).json(new ErrorResponse('Restaurant not found.'));
                return;
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findByIdOfUser = async (req, res) => {
        if (res.locals.id !== req.params.user_id) {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Order.findById(parseInt(req.params.id), req.body.status_id)
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Order listed successfully.', results[0]));
            } else {
                res.status(200).json(new ErrorResponse('Order not found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findByIdOfRestaurant = async (req, res) => {
        if (res.locals.role !== 'owner') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Restaurant.findById(parseInt(req.body.restaurant_id))
        .then(async results => {
            if (results.length > 0) {
                if (parseInt(res.locals.id) !== results[0].owner_id) {
                    res.status(401).json(new ErrorResponse('Unauthorized access.'));
                    return;
                } else {
                    await Order.findById(parseInt(req.params.id), req.body.status_id)
                    .then(subResults => {
                        if (subResults.length > 0) {
                            res.status(200).json(new SuccessDataResponse('Order listed successfully.', subResults[0]));
                        } else {
                            res.status(200).json(new ErrorResponse('Order not found.'));
                        }
                    }, () => {
                        res.status(500).json(new ErrorResponse('Internal server error.'));
                    });
                }
            } else {
                res.status(200).json(new ErrorResponse('Restaurant not found.'));
                return;
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    updateStatus = async (req, res) => {
        if (res.locals.role !== 'owner') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Restaurant.findById(parseInt(req.params.restaurant_id))
        .then(async results => {
            if (results.length > 0) {
                if (parseInt(res.locals.id) !== results[0].owner_id) {
                    res.status(401).json(new ErrorResponse('Unauthorized access.'));
                    return;
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
                return;
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new OrdersController;