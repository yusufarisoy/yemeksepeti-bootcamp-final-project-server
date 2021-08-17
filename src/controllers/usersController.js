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

    findById = async (req, res) => {
        await User.findById(parseInt(req.params.id))
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
                res.status(401).json(new ErrorResponse('Incorrect email or password.'));
                return;
            }
            user = results[0];
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
            return;
        });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json(new ErrorResponse('Incorrect email or password.'));
            return;
        }

        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign({ id: user.id.toString(), role: user.role, email: user.email }, secretKey);
        delete user.password;
        res.status(200).json(new LoginResponse('Logged in successfully.', token, user));
    }

    update = async (req, res) => {
        if (res.locals.id !== parseInt(req.params.id)) {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await User.update(parseInt(res.locals.id), req.body)
        .then(results => {
            if (results.affectedRows > 0) {
                res.status(200).json(new SuccessResponse('Information updated successfully.'));
            } else {
                res.status(200).json(new ErrorResponse('Information update failed.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
            return;
        });
    }

    changePassword = async (req, res) => {
        if (res.locals.id !== parseInt(req.params.id)) {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        const { oldPassword, newPassword } = req.body;
        await User.findById(parseInt(req.params.id))
        .then(async results => {
            if (results.length > 0) {
                const passwordMatch = await bcrypt.compare(oldPassword, results[0].password);
                if (!passwordMatch) {
                    res.status(200).json(new ErrorResponse('Incorrect password.'));
                    return;
                }
                newPassword = bcrypt.hashSync(newPassword, 8);
                await User.changePassword(parseInt(req.params.id), newPassword)
                .then(subResults => {
                    if (subResults.affectedRows > 0) {
                        res.status(200).json(new SuccessResponse('Password changed successfully.'));
                    } else {
                        res.status(200).json(new ErrorResponse('Password change failed.'));
                    }
                }, () => {
                    res.status(500).json(new ErrorResponse('Internal server error.'));
                    return;
                });
            } else {
                res.status(200).json(new ErrorResponse('User not found.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
        });
    }

    delete = async (req, res) => {
        if (res.locals.id !== parseInt(req.params.id)) {
            res.status(401).json(new ErrorResponse('Unauthorized access.'));
            return;
        }
        await User.delete(parseInt(req.params.id))
        .then(results => {
            if (results.affectedRows > 0) {
                res.status(200).json(new SuccessResponse('Account has been deleted successfully.'));
            } else {
                res.status(200).json(new ErrorResponse('Account delete failed.'));
            }
        }, () => {
            res.status(500).json(new ErrorResponse('Internal server error.'));
            return;
        });
    }
}

module.exports = new UsersController;