import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../../model/userDetailsSchema'
import connect from 'lib/mongodb';

export default async function getUserDetailsById(req: NextApiRequest, res: NextApiResponse) {
    connect();
    const { id } = req.body;
    const user = await User.findById(id).select({"email": 1, "firstName": 1, "lastName": 1})
    if (!user) {
        return res.status(400).json({ status: 'Not able to find the user' })
    } else {
        res.status(200).json({ user })
    }
}
