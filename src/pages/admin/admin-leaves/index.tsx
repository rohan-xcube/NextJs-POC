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
      });
      const leaveRequestsUserData = await response.json();
      let userInfoLeavesData: any = [];
      Object.values(leaveRequestsUserData.leavesData).map(async (item: any) => {
        const userDataResponse = await fetch(`${LOCALHOST_URL}/userDetails/getUserDetailsById`, {
          method: 'POST',
          body: JSON.stringify({ id: item.userId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const userData = await userDataResponse.json();
        const leavesData = { ...userData, ...item };
        userInfoLeavesData = [...userInfoLeavesData, { ...leavesData }]
        setUserLeavesData(userInfoLeavesData);
      }
      )
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

    const response = await fetch(`${LOCALHOST_URL}/leaveRequest/putLeaves?userId=${userDetailsWithLeaveDetails._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        userLeaveData: {
          leaveConfirmation, requestPending, fromDate: userDetailsWithLeaveDetails.fromDate,
          toDate: userDetailsWithLeaveDetails.toDate, message: userDetailsWithLeaveDetails.message,
          attachmentFileObject: userDetailsWithLeaveDetails.attachmentFileObject, userId: userDetailsWithLeaveDetails.userId
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

  return (
    <>
      <Navbar />
      {Object.values(userLeavesData).length ?
        Object.values(userLeavesData).filter((item: any) => item.requestPending).map((item2: any, i: any) => {
          return (
            <div key={i} className={styles.leavesBox}>
              <div>{item2.user.firstName} {item2.user.lastName} requested leave(s) from {convertTimeStampToDate(item2.fromDate)} to {convertTimeStampToDate(item2.toDate)}</div>
              <div className={styles.message}> message: {item2.message}</div>
              {item2.attachmentFileObject ? (
                <div className={styles.attachments}>
                  <a download='attachment' href={item2.attachmentFileObject}>click here to download attachment(s)</a>
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