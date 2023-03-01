import { convertTimeStampToDate } from '@/utils'
import { LOCALHOST_URL } from 'config/localhostUrl'
import React, { useEffect, useState } from 'react'
import Navbar from '../../navbar'
import styles from './index.module.css'

const AdminAttendances = () => {

  const [userAttendancesData, setUserAttendancesData] = useState<any>([])
  let requestPending = true;

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(`${LOCALHOST_URL}/attendanceRequest/getAllAttendances`, {
        method: 'GET'
      });
      const attendancesRequestsUserData = await response.json();
      let userInfoAttendancesData: any = [];
      Object.values(attendancesRequestsUserData.attendancesData).map(async (item: any) => {
        const userDataResponse = await fetch(`${LOCALHOST_URL}/userDetails/getUserDetailsById`, {
          method: 'POST',
          body: JSON.stringify({ id: item.userId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const userData = await userDataResponse.json();
        const attendancesData = { ...userData, ...item };
        userInfoAttendancesData = [...userInfoAttendancesData, { ...attendancesData }]
        setUserAttendancesData(userInfoAttendancesData);
      }
      )
    } catch (error) {
      console.log("error", error);
    }
  };

  const onClickButton = async (e: any, userDetailsWithAttendanceDetails: any) => {
    e.preventDefault()
    let attendanceConfirmation = false;
    if (e.target.value === 'accepted') {
      attendanceConfirmation = true;
    } else if (e.target.value === 'rejected') {
      attendanceConfirmation = false;
    }
    requestPending = false;

    const response = await fetch(`${LOCALHOST_URL}/attendanceRequest/putAttendances?userId=${userDetailsWithAttendanceDetails._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        userAttendanceData: {
          attendanceConfirmation, requestPending, requestType: userDetailsWithAttendanceDetails.requestType, fromDate: userDetailsWithAttendanceDetails.fromDate,
          toDate: userDetailsWithAttendanceDetails.toDate, location: userDetailsWithAttendanceDetails.location, message: userDetailsWithAttendanceDetails.message,
          time: userDetailsWithAttendanceDetails.time, userId: userDetailsWithAttendanceDetails.userId,
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
      {Object.values(userAttendancesData).length ?
        Object.values(userAttendancesData).filter((item: any) => item.requestPending).reverse().map((item2: any, i: any) => {
          return (
            <div key={i} className={styles.attendancesBox}>
              <div>{item2.user.firstName} {item2.user.lastName} requested attendance(s) from {convertTimeStampToDate(item2.fromDate)} to {convertTimeStampToDate(item2.toDate)}</div>
              <div className={styles.message}> message: {item2.message}</div>
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

export default AdminAttendances