import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Attendances from '../../../../model/applyAttendanceSchema'
import { convertTimeStampToString, returnYearFromTimeStamp } from '@/utils';

connect();
export default async function getAttendancesById(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, month, year } = req.query;
        const attendancesData = await Attendances.find({ userId: userId })
        let AttendanceDataPerMonth: any = [];
        if (attendancesData && attendancesData.length) {
            AttendanceDataPerMonth = attendancesData.filter((item: any) =>
            (
                (
                    (convertTimeStampToString(item.fromDate).toLowerCase().includes(month?.toLowerCase())) &&
                    (returnYearFromTimeStamp(item.fromDate) === year)
                ) ||
                (
                    (convertTimeStampToString(item.toDate).toLowerCase().includes(month?.toLowerCase())) &&
                    (returnYearFromTimeStamp(item.toDate) === year)
                )
            )
            )
        }
        res.status(200).json({ AttendanceDataPerMonth })
    } catch (error) {
        res.status(400).json({ message: "error occured" })
    }
}

