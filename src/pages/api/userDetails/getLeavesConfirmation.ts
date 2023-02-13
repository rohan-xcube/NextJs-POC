import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import LeaveConfirmation from '../../../../model/leaveConfirmationSchema'
 
export const config = {
    api: {
        responseLimit: false,
    },
}

export default async function getLeaves(req: NextApiRequest, res: NextApiResponse) {
connect();
    try {
        const {user_email} = req.query
        const leavesData = await LeaveConfirmation.findOne({ 'userDetailsWithLeaveDetails.email':  { $eq: user_email}} );
        res.status(200).json({ leavesData })
    } catch (error) {
        res.status(400).json({ message: "error occured" })
    }
}

