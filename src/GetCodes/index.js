import { LGACODES } from '../Utils';

const getCodes = (req, res) => {
    const data = Object.keys(LGACODES);
    return res.status(200).json({
        data
    });
}

module.exports = getCodes;