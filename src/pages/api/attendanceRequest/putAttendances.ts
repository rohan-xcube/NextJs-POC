import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import { transporter, mailOptions } from '../../../../config/nodemailer'
import { sendToAdminEmailLeave } from '../../../../templates/emailTemplates'
import Attendances from '../../../../model/applyAttendanceSchema'

export const config = {
    api: {
        responseLimit: false,
    },
}

export default async function putAttendances(req: NextApiRequest, res: NextApiResponse) {
    connect();
    try {
        const { userAttendanceData } = req.body;
        const { userId } = req.query
        const options = { new: true }

        const userAttendanceDetails = await Attendances.findByIdAndUpdate({ _id: userId }, userAttendanceData, options)
        // let sendMail = sendToUserEmailAttendance(userAttendanceConfirmationDetails?.userDetailsWithAttendanceDetails?.firstName,
        //   userAttendanceConfirmationDetails?.userDetailsWithAttendanceDetails?.lastName,
        //   userAttendanceConfirmationDetails?.userDetailsWithAttendanceDetails?.fromDate,
        //   userAttendanceConfirmationDetails?.userDetailsWithAttendanceDetails?.toDate,
        //   userAttendanceConfirmationDetails?.leaveConfirmation)
        // transporter.sendMail({
        //   ...mailOptions,
        //   subject: "Your Attendance(s) request has been acknowledged",
        //   text: "Plaintext version of the message",
        //   html: sendMail
        // })
        res.status(201).json(userAttendanceDetails)
        if (!userAttendanceDetails) {
            return res.json({ "code": "invalid data" })
        }
    }
    catch (error) {
        res.status(400).json({ status: 'data not submitted' })
    }

}

