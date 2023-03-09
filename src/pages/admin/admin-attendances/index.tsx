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
      setUserAttendancesData(attendancesRequestsUserData.userInfoAttendancesData);
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

    const response = await fetch(`${LOCALHOST_URL}/attendanceRequest/putAttendances?userId=${userDetailsWithAttendanceDetails._doc._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        userAttendanceData: {
          attendanceConfirmation, requestPending, requestType: userDetailsWithAttendanceDetails._doc.requestType, fromDate: userDetailsWithAttendanceDetails._doc.fromDate,
          toDate: userDetailsWithAttendanceDetails._doc.toDate, location: userDetailsWithAttendanceDetails._doc.location, message: userDetailsWithAttendanceDetails._doc.message,
          time: userDetailsWithAttendanceDetails._doc.time, userId: userDetailsWithAttendanceDetails._doc.userId,
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

  const sortBylatestDate = Object.values(userAttendancesData).map((obj: any) => { return { ...obj, date: new Date(obj?._doc?.createdAt) } }).sort((a, b) => b.date - a.date)

  return (
    <>
      <Navbar />
      {sortBylatestDate.length ?
        sortBylatestDate.filter((item: any) => item?._doc?.requestPending).map((item2: any, i: any) => {
          return (
            <div key={i} className={styles.attendancesBox}>
              <div>{item2.user.firstName} {item2.user.lastName} requested attendance(s) from {convertTimeStampToDate(item2?._doc?.fromDate)} to {convertTimeStampToDate(item2?._doc?.toDate)}</div>
              <div className={styles.message}> message: {item2?._doc?.message}</div>
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