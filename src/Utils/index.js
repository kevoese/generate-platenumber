import Joi from 'joi';
import jwt from 'jsonwebtoken';
import db from '../../db/models';

export const schema = {
    signUp:
        Joi.object().keys({
            firstname: Joi.string().trim().min(3).required(),
            lastname: Joi.string().trim().min(3).required(),
            email: Joi.string().email().lowercase().required(),
            password: Joi.string().min(6).required(),
        }),

    login:
        Joi.object().keys({
            email: Joi.string().email().lowercase().required(),
            password: Joi.string().required(),
        }),

    generate:
        Joi.object().keys({
            location: Joi.string().required(),
            min: Joi.number().integer().required(),
            max: Joi.number().integer().required(),
            count: Joi.number().integer().required(),
        }),
}

export const joiFormat = (error) => {
    const field = error.details[0].context.key;
    if (error.details[0].type === 'string.regex.base') return `wromg input for ${field}`;
    let format = error.message;
    format = format.slice(format.indexOf('[') + 1, format.indexOf(']'));
    format = format.replace(/"/gi, '');
    return format;
};

export const joiTest = (testObj, schemaObj, res, next) => {
    Joi.validate(testObj, schemaObj, (err) => {
        if (err) {
            return res.status(400).json({
                error: joiFormat(err)
            });
        }
        return next();
    });
};


export const getToken = (data) => jwt.sign(data, 'secret', {
    expiresIn: '5h'
})

export const decodeToken = token => jwt.verify(token, 'secret');

export const authenticate = async (req, res, next) => {
    const token = req.headers['token'];

    try {
        const result = decodeToken(token);
        const { email } = result;
        const user = await db.User.findOne({
            where: { email }
        })
        if (!user) {
            return res.status(401).json({
                message: `unauthorized access`
            })
        }
        else {
            req.user = user.dataValues;

            return next();
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: `unauthorized access.`
        })
    }



}

export const LGACODES = {
    ikeja: 'IKJ',
    ikorodu: 'IKD',
};