import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Attendances from '../../../../model/applyAttendanceSchema'

connect();
export default async function deleteAttendances(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { user_id } = req.query
        await Attendances.deleteOne({ _id: user_id });
        res.status(200).json({ message: "one record deleted" })
    } catch (error) {
        res.status(400).json({ message: "error occured" })
    }
}

