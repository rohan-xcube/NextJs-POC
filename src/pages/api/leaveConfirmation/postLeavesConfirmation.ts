import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import LeaveConfirmation from '../../../../model/leaveConfirmationSchema'
import { transporter, mailOptions } from '../../../../config/nodemailer'
import { sendToUserEmailLeave } from '../../../../templates/emailTemplates'

export default async function postLeavesConfirmation(req: NextApiRequest, res: NextApiResponse) {
  connect();
  try {
    const { LeaveDetails } = req.body;
    const userLeaveConfirmationDetails = await LeaveConfirmation.create(LeaveDetails)
    let sendMail = sendToUserEmailLeave(userLeaveConfirmationDetails?.userDetailsWithLeaveDetails?.firstName,
      userLeaveConfirmationDetails?.userDetailsWithLeaveDetails?.lastName,
      userLeaveConfirmationDetails?.userDetailsWithLeaveDetails?.fromDate,
      userLeaveConfirmationDetails?.userDetailsWithLeaveDetails?.toDate,
      userLeaveConfirmationDetails?.leaveConfirmation)
    transporter.sendMail({
      ...mailOptions,
      subject: "Your Leave(s) request has been acknowledged",
      text: "Plaintext version of the message",
      html: sendMail
    })
    res.status(201).json(userLeaveConfirmationDetails)
    if (!userLeaveConfirmationDetails) {
      return res.json({ "code": "invalid data" })
    }
  }
  catch (error) {
    res.status(400).json({ status: 'data not submitted' })
  }

}

