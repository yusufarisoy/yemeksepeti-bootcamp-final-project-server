const Address = require('../models/address');
const { SuccessResponse, SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class AddressesController {

    create = async (req, res) => {
        if (res.locals.role !== 'user') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Address.create(parseInt(res.locals.id), req.body)
        .then(() => {
            res.status(200).json(new SuccessResponse('Address created successfully.'));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findAll = async (_req, res) => {
        if (res.locals.role !== 'user') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Address.findAll(parseInt(res.locals.id))
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Addresses listed successfully.', results));
            } else {
                res.status(200).json(new ErrorResponse('No address found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findById = async (req, res) => {
        if (res.locals.role !== 'user') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Address.findById(parseInt(res.locals.id), parseInt(req.params.id))
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Address listed successfully.', results));
            } else {
                res.status(200).json(new ErrorResponse('Address not found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    update = async (req, res) => {
        if (res.locals.role !== 'user') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Address.findById(parseInt(res.locals.id), parseInt(req.params.id))
        .then(async results => {
            if (results.length > 0) {
                if (parseInt(res.locals.id !== results[0].user_id)) {
                    res.status(401).json(new ErrorResponse('Unauthorized access.'));
                    return;
                } else {
                    await Address.update(parseInt(req.params.id), req.body)
                    .then(subResults => {
                        if (subResults.affectedRows > 0) {
                            res.status(200).json(new SuccessResponse('Address updated successfully.'));
                        } else {
                            res.status(200).json(new ErrorResponse('Address update failed.'));
                        }
                    }, () => {
                        res.status(500).json(new ErrorResponse('Internal server error.'));
                    });
                }
            } else {
                res.status(200).json(new ErrorResponse('Address not found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    delete = async (req, res) => {
        if (res.locals.role !== 'user') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Address.findById(parseInt(res.locals.id), parseInt(req.params.id))
        .then(async results => {
            if (results.length > 0) {
                if (parseInt(res.locals.id !== results[0].user_id)) {
                    res.status(401).json(new ErrorResponse('Unauthorized access.'));
                    return;
                } else {
                    await Address.delete(parseInt(req.params.id))
                    .then(subResults => {
                        if (subResults.affectedRows > 0) {
                            res.status(200).json(new SuccessResponse('Address has been deleted successfully.'));
                        } else {
                            res.status(200).json(new ErrorResponse('Address delete failed.'));
                        }
                    }, () => {
                        res.status(500).json(new ErrorResponse('Internal server error.'));
                    });
                }
            } else {
                res.status(200).json(new ErrorResponse('Address not found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new AddressesController;