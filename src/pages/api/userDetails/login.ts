import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../../model/userDetailsSchema'
import connect from 'lib/mongodb';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
connect();
    const user = await User.findOne({ email: req.body.loginData.email, password: req.body.loginData.password })
    if (!user) {
      return res.status(400).json({ status: 'Not able to find the user' })
    } else {
      res.status(201).json({ user })
    }
}
