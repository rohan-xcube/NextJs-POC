import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Attendances from '../../../../model/applyAttendanceSchema'
import { LOCALHOST_URL } from 'config/localhostUrl';

connect();
export default async function getAllAttendances(req: NextApiRequest, res: NextApiResponse) {
  try {
    const attendancesData = await Attendances.find({});
    let userInfoAttendancesData: any = [];
    await Promise.all(Object.values(attendancesData).map(async (item: any) => {
      const userDataResponse = await fetch(`${LOCALHOST_URL}/userDetails/getUserDetailsById`, {
        method: 'POST',
        body: JSON.stringify({ id: item.userId }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      await userDataResponse.json().then((res) => {
        let attendancesData = { ...res, ...item };
        userInfoAttendancesData = [...userInfoAttendancesData, { ...attendancesData }]
      })
    }
    ))
    res.status(200).json({ userInfoAttendancesData })
  } catch (error) {
    res.status(400).json({ message: "error occured" })
  }
}

