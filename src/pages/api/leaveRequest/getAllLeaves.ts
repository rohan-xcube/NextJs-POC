import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Leaves from '../../../../model/applyLeaveSchema'
import { LOCALHOST_URL } from 'config/localhostUrl';

connect();
export default async function getAllLeaves(req: NextApiRequest, res: NextApiResponse) {
  try {
      const leavesData = await Leaves.find({});
      let userInfoLeavesData: any = [];
      await Promise.all(Object.values(leavesData).map(async (item: any) => {
          const userDataResponse = await fetch(`${LOCALHOST_URL}/userDetails/getUserDetailsById`, {
              method: 'POST',
              body: JSON.stringify({ id: item.userId }),
              headers: {
                  'Content-Type': 'application/json',
              },
          })
          await userDataResponse.json().then((res) => {
              let leavesData = { ...res, ...item };
              userInfoLeavesData = [...userInfoLeavesData, { ...leavesData }]
          })
      }
      ))
      res.status(200).json({ userInfoLeavesData })
} catch (error) {
        res.status(400).json({ message: "error occured" })
    }
}

