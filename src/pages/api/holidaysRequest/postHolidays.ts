import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Holidays from '../../../../model/inputHolidaysSchema'

export default async function postHolidays(req: NextApiRequest, res: NextApiResponse) {
    connect();
    try {
        const { holidaysData } = req.body;
        const holidaysDetails = await Holidays.create(holidaysData)
        res.status(201).json(holidaysDetails)
        if (!holidaysDetails) {
            return res.json({ "code": "invalid data" })
        }
    }
    catch (error) {
        res.status(400).json({ status: 'data not submitted' })
    }

}

// get holidays per year