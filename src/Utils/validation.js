import {joiTest, schema} from './index';

export const validateSignup = (req, res, next) => {
    const {
        firstname, lastname, email, password,
    } = req.body;
    const user = {
        firstname, lastname, email, password,
    };
    joiTest(user, schema.signUp, res, next);
}

export const validateLogin = (req, res, next) => {
    const {
        email, password,
    } = req.body;
    joiTest({ email, password }, schema.login, res, next);
}

export const validateGenerate = (req, res, next) => {
    const {
        range, count, location
    } = req.body;
    
    const min = range && range.split('-')[0] || null;
    const max = range && range.split('-')[1] || null;
    joiTest({ count, location, min, max }, schema.generate, res, next);
}

