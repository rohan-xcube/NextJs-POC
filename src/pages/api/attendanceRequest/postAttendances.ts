import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Attendances from '../../../../model/applyAttendanceSchema'
import { transporter, mailOptions } from '../../../../config/nodemailer'
import { sendToAdminEmailAttendance } from '../../../../templates/emailTemplates'

export default async function postAttendances(req: NextApiRequest, res: NextApiResponse) {
  connect();
  try {
    const { userAttendanceData } = req.body;
    const userAttendanceDetails = await Attendances.create(userAttendanceData)
    let sendMail = sendToAdminEmailAttendance(userAttendanceDetails?.firstName, userAttendanceDetails?.lastName, userAttendanceDetails?.fromDate, userAttendanceDetails?.toDate)
    transporter.sendMail({
      ...mailOptions,
      subject: "Attendance request(s)",
      text: "Plaintext version of the message",
      html: sendMail
    })
    res.status(201).json(userAttendanceDetails)
    if (!userAttendanceDetails) {
      return res.json({ "code": "invalid data" })
    }
  }
  catch (error) {
    res.status(400).json({ status: 'data not submitted' })
  }

}

