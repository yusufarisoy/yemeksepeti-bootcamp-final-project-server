const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { ErrorResponse } = require('../utils/httpResponses');

module.exports = () => {
    return async (req, res, next) => {
        try {
            const header = req.headers.authorization;
            const bearer = 'Bearer';
            if(!header || !header.startsWith(bearer)) {
                return res.status(401).json(new ErrorResponse('Unauthorized access.'));
            }

            const token = header.slice(7);
            const secretKey = process.env.JWT_SECRET;
            jwt.verify(token, secretKey, async (error, decoded) => {
                if (error) {
                    return res.status(401).json(new ErrorResponse('Authentication failed.'));
                }

                await User.authorize(decoded.id, decoded.email)
                .then(results => {
                    if (results.length === 0) {
                        return res.status(401).json(new ErrorResponse('Authentication failed.'));
                    }
                    res.locals.id = decoded.id;
                    res.locals.role = decoded.role;
                    next();
                }, () => {
                    return res.status(401).json(new ErrorResponse('Authentication failed.'));
                });
            });
        } catch (ex) {
            ex.status = 401;
            next(ex);
        }
    }
}