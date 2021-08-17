const City = require('../models/city');
const { SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class CitiesController {

    findAll = async (_req, res) => {
        await City.findAll()
        .then(results => {
            res.status(200).json(new SuccessDataResponse('Cities listed successfully.', results));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new CitiesController;