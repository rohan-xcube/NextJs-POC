import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Leaves from '../../../../model/applyLeaveSchema'


export const config = {
    api: {
        responseLimit: false,
    },
}

connect();
export default async function deleteLeaves(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { user_id } = req.query
        await Leaves.deleteOne({ _id: user_id });
        res.status(200).json({ message: "one record deleted" })
    } catch (error) {
        res.status(400).json({ message: "error occured" })
    }
}

