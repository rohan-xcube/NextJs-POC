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

export default async function postLeaves(req: NextApiRequest, res: NextApiResponse) {
connect();
  try {
    const { userLeaveData } = req.body;
    const userLeaveDetails = await Leaves.create(userLeaveData)
    let sendMail = sendToAdminEmailLeave(userLeaveDetails?.firstName, userLeaveDetails?.lastName, userLeaveDetails?.fromDate, userLeaveDetails?.toDate)
    transporter.sendMail({
      ...mailOptions,
      subject: "Leave request(s)",
      text: "Plaintext version of the message",
      html: sendMail
    })
    res.status(201).json(userLeaveDetails)
    if (!userLeaveDetails) {
      return res.json({ "code": "invalid data" })
    }
  }
  catch (error) {
    res.status(400).json({ status: 'data not submitted' })
  }

}

