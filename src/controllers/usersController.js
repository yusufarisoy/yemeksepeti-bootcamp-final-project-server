const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');
const { LoginResponse, SuccessResponse, SuccessDataResponse, ErrorResponse } = require('../utils/httpResponses');

class UsersController {

    create = async (req, res) => {
        await User.create(req.body)
        .then(() => {
            res.status(200).json(new SuccessResponse('Registered successfully.'));
        }, error => {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(200).json(new ErrorResponse('This email is already in use.'));
            } else {
                res.status(500).json(new ErrorResponse('Internal server error.'));
            }
        });
    }

    findById = async (_req, res) => {
        await User.findById(parseInt(res.locals.id))
        .then(results => {
            if (results.length > 0) {
                delete results[0].password;
                res.status(200).json(new SuccessDataResponse('User listed successfully.', results[0]));
            } else {
                res.status(200).json(new ErrorResponse('User not found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    login = async (req, res) => {
        const { email, password } = req.body;

        let user;
        await User.findByEmail(email)
        .then(results => {
            if (results.length == 0) {
                return res.status(401).json(new ErrorResponse('Incorrect email or password.'));
            }
            user = results[0];
        }, () => {
            return res.status(500).json(new ErrorResponse('Internal server error.'));
        });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json(new ErrorResponse('Incorrect email or password.'));
        }

        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign({ id: user.id.toString(), role: user.role, email: user.email }, secretKey);
        delete user.password;
        res.status(200).json(new LoginResponse('Logged in successfully.', token, user));
    }

    update = async (req, res) => {
        await User.update(parseInt(res.locals.id), req.body)
        .then(results => {
            if (results.affectedRows > 0) {
                res.status(200).json(new SuccessResponse('Information updated successfully.'));
            } else {
                res.status(200).json(new ErrorResponse('Information update failed.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    changePassword = async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        await User.findById(parseInt(res.locals.id))
        .then(async results => {
            if (results.length > 0) {
                const passwordMatch = await bcrypt.compare(oldPassword, results[0].password);
                if (!passwordMatch) {
                    return res.status(200).json(new ErrorResponse('Incorrect password.'));
                }
                newPassword = bcrypt.hashSync(newPassword, 8);
                await User.changePassword(parseInt(res.locals.id), newPassword)
                .then(subResults => {
                    if (subResults.affectedRows > 0) {
                        res.status(200).json(new SuccessResponse('Password changed successfully.'));
                    } else {
                        res.status(200).json(new ErrorResponse('Password change failed.'));
                    }
                }, () => {
                    res.status(500).json(new ErrorResponse('Internal server error.'));
                });
            } else {
                res.status(200).json(new ErrorResponse('User not found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    delete = async (_req, res) => {
        await User.delete(parseInt(res.locals.id))
        .then(results => {
            if (results.affectedRows > 0) {
                res.status(200).json(new SuccessResponse('Account has been deleted successfully.'));
            } else {
                res.status(200).json(new ErrorResponse('Account delete failed.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }
}

module.exports = new UsersController;