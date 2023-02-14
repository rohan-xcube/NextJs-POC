import type { NextApiRequest, NextApiResponse } from 'next'
import connect from 'lib/mongodb';
import Leaves from '../../../../model/applyLeaveSchema'


export const config = {
  api: {
    responseLimit: false,
  },
}

connect();
export default async function getLeaves(req: NextApiRequest, res: NextApiResponse) {
  try {
    const leavesData = await Leaves.find({});
    res.status(200).json({leavesData})
  } catch (error) {
    res.status(400).json({message:"error occured"})
  }
}
