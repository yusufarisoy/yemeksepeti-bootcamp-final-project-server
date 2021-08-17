const Order_Food = require('../models/order_food');
const { SuccessResponse, SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class Order_FoodController {

    create = async (req, res) => {
        if (res.locals.role !== 'user') {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await Order_Food.create(req.body.food_list)
        .then(() => {
            res.status(200).json(new SuccessResponse('Food added successfully.'));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    findAll = async (req, res) => {
        await Order_Food.findAll(parseInt(req.params.order_id))
        .then(results => {
            if (results.length > 0) {
                res.status(200).json(new SuccessDataResponse('Foods of order listed successfully.', results));
            } else {
                res.status(200).json(new ErrorResponse('No food found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new Order_FoodController;