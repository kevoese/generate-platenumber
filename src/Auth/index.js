import express from 'express';
import db from '../../db/models';
import { getToken } from '../Utils';
import { validateLogin, validateSignup } from '../Utils/validation';

const { User } = db;

const router = express();

router.post('/signin', validateLogin, async (req, res) => {
    const { body: { password, email } } = req;

    try {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (user) {
            if (password !== user.dataValues.password) {
                return res.status(400).json({
                    message: 'email or password is invalid'
                })
            }

            const token = getToken({ id: user.dataValues.id, email: user.dataValues.email });
            return res.status(200).json({
                message: 'login successfully',
                token,
                data: { ...user.dataValues, password: '' }
            });

        }
        else {
            return res.status(400).json({
                message: 'email or password is invalid'
            })
        }
    }
    catch (err) {
        return res.status(200).json({
            message: 'Something went wrong',

        });
    }


})

router.post('/signup', validateSignup, async (req, res) => {
    const { body: { firstname, lastname, password, email } } = req;
    // check if user already exists
    try {

        const user = await User.findOne({
            where: {
                email
            }
        })

        if (user) {
            return res.status(400).json({
                message: 'user already exist'
            })
        }
        const newUser = await User.create({ first_name: firstname, last_name: lastname, password, email })
        if (newUser) {
            const token = getToken({ id: newUser.id, email: newUser.email })
            return res.json({
                message: 'sign up successfully',
                token,
                data: { ...newUser.dataValues, password: '' }
            })
        }
    } catch (error) {

        return res.status(500).json({
            message: 'Something went wrong',
        })
    }

})



module.exports = router;