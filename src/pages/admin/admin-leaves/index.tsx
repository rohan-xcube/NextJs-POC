import { convertTimeStampToDate } from '@/utils'
import { LOCALHOST_URL } from 'config/localhostUrl'
import React, { useEffect, useState } from 'react'
import Navbar from '../../navbar'
import styles from './index.module.css'

const AdminLeaves = () => {

  const [userLeavesData, setUserLeavesData] = useState<any>([])
  let requestPending = true;

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(`${LOCALHOST_URL}/leaveRequest/getAllLeaves`, {
        method: 'GET'
      })
      const leaveRequestsUserData = await response.json()
      setUserLeavesData(leaveRequestsUserData.userInfoLeavesData);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onClickButton = async (e: any, userDetailsWithLeaveDetails: any) => {
    e.preventDefault();
    let leaveConfirmation = false;
    if (e.target.value === 'accepted') {
      leaveConfirmation = true;
    } else if (e.target.value === 'rejected') {
      leaveConfirmation = false;
    }
    requestPending = false;
    const response = await fetch(`${LOCALHOST_URL}/leaveRequest/putLeaves?userId=${userDetailsWithLeaveDetails._doc._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        userLeaveData: {
          leaveConfirmation, requestPending, fromDate: userDetailsWithLeaveDetails._doc.fromDate,
          toDate: userDetailsWithLeaveDetails._doc.toDate, message: userDetailsWithLeaveDetails._doc.message,
          attachmentFileObject: userDetailsWithLeaveDetails._doc.attachmentFileObject, userId: userDetailsWithLeaveDetails._doc.userId
        }
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    console.log(data, 'data');
    window.location.reload();
  }

  const sortBylatestDate = Object.values(userLeavesData).map((obj: any) => { return { ...obj, date: new Date(obj?._doc?.createdAt) } }).sort((a, b) => b.date - a.date)

  return (
    <>
      <Navbar />
      {sortBylatestDate.length ?
        sortBylatestDate.filter((item: any) => item?._doc?.requestPending).map((item2: any, i: any) => {
          return (
            <div key={i} className={styles.leavesBox}>
              <div>{item2.user?.firstName} {item2.user?.lastName} requested leave(s) from {convertTimeStampToDate(item2?._doc?.fromDate)} to {convertTimeStampToDate(item2?._doc?.toDate)}</div>
              <div className={styles.message}> message: {item2?._doc?.message}</div>
              {item2._doc?.attachmentFileObject ? (
                <div className={styles.attachments}>
                  <a download='attachment' href={item2?._doc?.attachmentFileObject}>click here to download attachment(s)</a>
                </div>
              ) : ''}
              <div className={styles.buttons}>
                <button onClick={(e) => onClickButton(e, item2)} value={'accepted'}>Accept</button>
                <button onClick={(e) => onClickButton(e, item2)} value={'rejected'}>Reject</button>
              </div>
            </div>
          )
        }) : <div className={styles.noRequests}>No requests by users</div>
      }
    </>
  )
}

export default AdminLeaves