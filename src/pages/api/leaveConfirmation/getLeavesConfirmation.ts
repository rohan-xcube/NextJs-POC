import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import LeaveConfirmation from '../../../../model/leaveConfirmationSchema'

export default async function getLeavesConfirmation(req: NextApiRequest, res: NextApiResponse) {
connect();
    try {
        const {user_email} = req.query
        const leavesData = await LeaveConfirmation.findOne({ 'userDetailsWithLeaveDetails.email':  { $eq: user_email}} );
        res.status(200).json({ leavesData })
    } catch (error) {
        res.status(400).json({ message: "error occured" })
    }
}

