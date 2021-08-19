const Address = require('../models/address');
const { SuccessResponse, SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class AddressesController {

    create = async (req, res) => {
        if (res.locals.role !== 'user') {
            return res.status(401).json(new ErrorResponse('Unauthorized access.'));
        }
        await Address.create(parseInt(res.locals.id), req.body)
        .then(() => {
            res.status(200).json(new SuccessResponse('Address created successfully.'));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findAll = async (_req, res) => {
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

    update = async (req, res) => {
        await Address.update(parseInt(res.locals.id), parseInt(req.params.id), req.body)
        .then(results => {
            if (results.affectedRows > 0) {
                res.status(200).json(new SuccessResponse('Address updated successfully.'));
            } else {
                res.status(200).json(new ErrorResponse('Address update failed.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    delete = async (req, res) => {
        await Address.delete(parseInt(res.locals.id), parseInt(req.params.id))
        .then(results => {
            if (results.affectedRows > 0) {
                res.status(200).json(new SuccessResponse('Address has been deleted successfully.'));
            } else {
                res.status(200).json(new ErrorResponse('Address delete failed.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new AddressesController;