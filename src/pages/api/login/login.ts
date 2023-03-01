import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../../model/userDetailsSchema'
import connect from 'lib/mongodb';
import mongoose from 'mongoose';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  connect();
  // console.log(mongoose.Schema.Types.ObjectId, 'objectid');
  
  const user = await User.findOne({ email: req.body.loginData.email, password: req.body.loginData.password })
  // .populate({ path: 'leaves', select: 'fromDate' }).exec()
  // .populate({ path: "user", model: "User" })

  // console.log(user, 'user');
  

  if (!user) {
    return res.status(400).json({ status: 'Not able to find the user' })
  } else {
    res.status(201).json({ user })
  }
}
