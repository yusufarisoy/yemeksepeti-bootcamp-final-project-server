const PaymentType = require('../models/paymentType');
const { SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class PaymentTypesController {

    findAll = async (_req, res) => {
        await PaymentType.findAll()
        .then(results => {
            res.status(200).json(new SuccessDataResponse('Payment Types listed successfully.', results));
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new PaymentTypesController;