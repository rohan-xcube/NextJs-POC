import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import AttendanceConfirmation from '../../../../model/attendanceConfirmationSchema'

export default async function getAttendancesConfirmation(req: NextApiRequest, res: NextApiResponse) {
connect();
    try {
        const {user_email} = req.query
        const attendancesData = await AttendanceConfirmation.findOne({ 'userDetailsWithAttendanceDetails.email':  { $eq: user_email}} );
        res.status(200).json({ attendancesData })
    } catch (error) {
        res.status(400).json({ message: "error occured" })
    }
}

