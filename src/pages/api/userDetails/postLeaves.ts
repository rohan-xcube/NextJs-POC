import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Leaves from '../../../../model/applyLeaveSchema'


export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function postLeaves(req: NextApiRequest, res: NextApiResponse) {
connect();
  try {
    const userLeaveDetails = await Leaves.create(req.body.userLeaveData)
    res.status(201).json(userLeaveDetails)
    if (!userLeaveDetails) {
      return res.json({ "code": "invalid data" })
    }
  } 
  catch (error) {
    res.status(400).json({ status: 'data not submitted' })
  }

}

