const Food = require('../models/food');
const Restaurant = require('../models/restaurant');
const { SuccessResponse, SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class FoodsController {

    create = async (req, res) => {
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
                    await Food.create(parseInt(req.params.restaurant_id), req.body)
                    .then(() => {
                        res.status(200).json(new SuccessResponse('Food created successfully.'));
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
            return;
        });
    }

    findAll = async (req, res) => {
        await Food.findAll(parseInt(req.params.restaurant_id))
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Foods listed successfully.', results));
            } else {
                res.status(200).json(new ErrorResponse('No food found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    update = async (req, res) => {
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
                    await Food.update(parseInt(req.params.restaurant_id), parseInt(req.params.id), req.body)
                    .then(subResults => {
                        if (subResults.affectedRows > 0) {
                            res.status(200).json(new SuccessResponse('Food updated successfully.'));
                        } else {
                            res.status(200).json(new ErrorResponse('Food update failed.'));
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
            return;
        });
    }

    delete = async (req, res) => {
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
                    await Food.delete(parseInt(req.params.restaurant_id), parseInt(req.params.id))
                    .then(subResults => {
                        if (subResults.affectedRows > 0) {
                            res.status(200).json(new SuccessResponse('Food has been deleted successfully.'));
                        } else {
                            res.status(200).json(new ErrorResponse('Food delete failed.'));
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
            return;
        });
    }
}

module.exports = new FoodsController;