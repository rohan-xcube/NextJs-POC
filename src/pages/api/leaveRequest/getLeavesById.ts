import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Leaves from '../../../../model/applyLeaveSchema'
import { convertTimeStampToString, returnYearFromTimeStamp } from '@/utils';

connect();
export default async function getLeavesById(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, month, year } = req.query;
    const leavesData = await Leaves.find({ userId: userId });
    let leavesDataPerMonth: any = [];
    if (leavesData && leavesData.length) {
      leavesDataPerMonth = leavesData.filter((item: any) =>
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
    res.status(200).json({ leavesDataPerMonth })
  } catch (error) {
    res.status(400).json({ message: "error occured" })
  }
}

