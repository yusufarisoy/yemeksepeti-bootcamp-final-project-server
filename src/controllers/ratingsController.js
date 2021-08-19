const Rating = require('../models/rating');
const { SuccessResponse, SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class RatingsController {

    create = async (req, res) => {
        if (res.locals.role !== 'user') {
            return res.status(401).json(new ErrorResponse('Unauthorized access.'));
        }
        await Rating.create(parseInt(res.locals.id), req.body)
        .then(() => {
            res.status(200).json(new SuccessResponse('Restaurant rated successfully.'));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findAll = async (req, res) => {
        await Rating.findAll(req.body.restaurant_id)
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Ratings of restaurant listed successfully.', results));
            } else {
                res.status(200).json(new ErrorResponse('No rating found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new RatingsController;