import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import AttendanceConfirmation from '../../../../model/attendanceConfirmationSchema'
import { transporter, mailOptions } from '../../../../config/nodemailer'
import { sendToUserEmailAttendance } from '../../../../templates/emailTemplates'

export default async function postAttendancesConfirmation(req: NextApiRequest, res: NextApiResponse) {
  connect();
  try {
    const { AttendanceDetails } = req.body;
    const userAttendanceConfirmationDetails = await AttendanceConfirmation.create(AttendanceDetails)
    let sendMail = sendToUserEmailAttendance(userAttendanceConfirmationDetails?.userDetailsWithAttendanceDetails?.firstName,
      userAttendanceConfirmationDetails?.userDetailsWithAttendanceDetails?.lastName,
      userAttendanceConfirmationDetails?.userDetailsWithAttendanceDetails?.fromDate,
      userAttendanceConfirmationDetails?.userDetailsWithAttendanceDetails?.toDate,
      userAttendanceConfirmationDetails?.leaveConfirmation)
    transporter.sendMail({
      ...mailOptions,
      subject: "Your Attendance(s) request has been acknowledged",
      text: "Plaintext version of the message",
      html: sendMail
    })
    res.status(201).json(userAttendanceConfirmationDetails)
    if (!userAttendanceConfirmationDetails) {
      return res.json({ "code": "invalid data" })
    }
  }
  catch (error) {
    res.status(400).json({ status: 'data not submitted' })
  }

}

