import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import LeaveConfirmation from '../../../../model/leaveConfirmationSchema'


export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function postLeavesConfirmation(req: NextApiRequest, res: NextApiResponse) {
connect();
  try {
    const userLeaveConfirmationDetails = await LeaveConfirmation.create(req.body.LeaveDetails)
    res.status(201).json(userLeaveConfirmationDetails)
    if (!userLeaveConfirmationDetails) {
      return res.json({ "code": "invalid data" })
    }
  } 
  catch (error) {
    res.status(400).json({ status: 'data not submitted' })
  }

}

