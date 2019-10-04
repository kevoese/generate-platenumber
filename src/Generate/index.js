import express from 'express';
import db from '../../db/models';
import { authenticate, LGACODES } from '../Utils';
import { validateGenerate } from '../Utils/validation';


const { PlateNumber, User } = db;

const router = express();

router.get('/', authenticate, async (req, res) => {
    // return generated platenumbers
    try {
        const platenumbers = await PlateNumber.findAll({
            where: {},
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['first_name', 'last_name', 'email', 'id']
                }
            ]
        });

        if (platenumbers) {
            return res.json({
                message: 'platenumbers',
                data: platenumbers
            })
        }
    }
    catch (err) {
        return res.json({
            message: 'Something went wrong',
        });
    };

    return res.json({
        message: 'Something went wrong',
    });

});

const randomChar = () => {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 25)) + String.fromCharCode(65 + Math.floor(Math.random() * 25));
    return letter;
};

router.post('/', authenticate, validateGenerate, async (req, res) => {
    const { body: { range, location, count } } = req;

    const highest = Number(range.split('-')[1]);
    const lowest = Number(range.split('-')[0]);

    const randomNum = async () => {
        const val = Math.floor(Math.random() * (1000 - highest)) + highest;
        const platenumber = `${randomChar()} ${val} ${LGACODES[location]}`;
        const data = await PlateNumber.findOne({
            where: {
                platenumber
            }
        });
        if (data) {
            return randomNum();
        }
        return platenumber;
    };
    // generate random query
    let platenumberData = [];
    for (let counter = 0; counter < count; counter++) {
        const number = await randomNum();
        platenumberData.push(number)
    }

  
   const createData = platenumberData.map(platenumber => ({ userId: req.user.id, platenumber }));
    try {
        const newPlateNumber = await PlateNumber.bulkCreate(createData);

        if (newPlateNumber)
            return res.json({
                message: 'platenumber generated successfully',
                data: newPlateNumber
            })

    } catch (error) {
        return res.json({
            message: 'Something went wrong',
        });
    }
})



module.exports = router;
