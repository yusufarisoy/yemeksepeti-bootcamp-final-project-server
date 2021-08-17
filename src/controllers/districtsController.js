const District = require('../models/district');
const { SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class DistrictsController {

    findAll = async (_req, res) => {
        await District.findAll()
        .then(results => {
            res.status(200).json(new SuccessDataResponse('Districts listed successfully.', results));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new DistrictsController;