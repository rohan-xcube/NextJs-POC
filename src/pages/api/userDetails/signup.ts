import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import User from '../../../../model/userDetailsSchema'

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  connect();
  try {
    const userDetails = await User.create(req.body.userData)
    res.status(201).json(userDetails)
    if (!userDetails) {
      return res.json({ "code": "user not created" })
    }
  } catch (error) {
    res.status(400).json({ status: 'Not able to create a new user' })
  }
}

