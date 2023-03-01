import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Leaves from '../../../../model/applyLeaveSchema'
import { transporter, mailOptions } from '../../../../config/nodemailer'
import { sendToAdminEmailLeave } from '../../../../templates/emailTemplates'

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function putLeaves(req: NextApiRequest, res: NextApiResponse) {
  connect();
  try {
    const { userLeaveData } = req.body;
    const { userId } = req.query
    const options = { new: true }

    const userLeaveDetails = await Leaves.findByIdAndUpdate({ _id: userId }, userLeaveData, options)
    // let sendMail = sendToUserEmailLeave(userLeaveConfirmationDetails?.userDetailsWithLeaveDetails?.firstName,
    //   userLeaveConfirmationDetails?.userDetailsWithLeaveDetails?.lastName,
    //   userLeaveConfirmationDetails?.userDetailsWithLeaveDetails?.fromDate,
    //   userLeaveConfirmationDetails?.userDetailsWithLeaveDetails?.toDate,
    //   userLeaveConfirmationDetails?.leaveConfirmation)
    // transporter.sendMail({
    //   ...mailOptions,
    //   subject: "Your Leave(s) request has been acknowledged",
    //   text: "Plaintext version of the message",
    //   html: sendMail
    // })
    res.status(201).json(userLeaveDetails)
    if (!userLeaveDetails) {
      return res.json({ "code": "invalid data" })
    }
  }
  catch (error) {
    res.status(400).json({ status: 'data not submitted' })
  }

}

