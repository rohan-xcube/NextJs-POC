import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Attendances from '../../../../model/applyAttendanceSchema'

connect();
export default async function getAllAttendances(req: NextApiRequest, res: NextApiResponse) {
  try {
    const attendancesData = await Attendances.find({});
    res.status(200).json({ attendancesData })
  } catch (error) {
    res.status(400).json({ message: "error occured" })
  }
}

