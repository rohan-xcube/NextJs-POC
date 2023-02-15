import { LOCALHOST_URL } from 'config/localhostUrl'
import React, { useEffect, useState } from 'react'
import Navbar from '../../navbar'
import styles from './index.module.css'

const AdminAttendances = () => {

  const [userAttendancesData, setUserAttendancesData] = useState<any>({})

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(`${LOCALHOST_URL}/attendanceRequest/getAttendances`, {
        method: 'GET'
      });
      const json = await response.json();
      setUserAttendancesData(json.attendancesData)
    } catch (error) {
      console.log("error", error);
    }
  };

  const onClickButton = async (e: any, userDetailsWithAttendanceDetails: any) => {
    e.preventDefault()
    var attendanceConfirmation = e.target.value
    const response = await fetch(`${LOCALHOST_URL}/attendanceConfirmation/postAttendancesConfirmation`, {
      method: 'POST',
      body: JSON.stringify({ AttendanceDetails: { attendanceConfirmation, userDetailsWithAttendanceDetails } }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    console.log(data, 'data');

    (Object.values(userAttendancesData).forEach((item1: any, index: any) => {
      if ((item1.email.toLowerCase() === userDetailsWithAttendanceDetails.email.toLowerCase()) &&
        (item1.message.toLowerCase() === userDetailsWithAttendanceDetails.message.toLowerCase())) {
        const deleteData = async () => {
          try {
            await fetch(`${LOCALHOST_URL}/attendanceRequest/deleteAttendances?user_id=${item1?._id}`, {
              method: 'DELETE'
            });
            let selectedValue = userAttendancesData
            selectedValue.splice(index, 1)
            setUserAttendancesData(Object.values(selectedValue))
          } catch (error) {
            console.log("error", error);
          }
        }
        deleteData()
      }
    }))
  }

  return (
    <>
      <Navbar/>
      {Object.values(userAttendancesData).length ?
        Object.values(userAttendancesData).map((item: any, i: any) => {
          return (
            <div key={i} className={styles.attendancesBox}>
              <div>{item.firstName} {item.lastName} requested attendance(s) from {item.fromDate} to {item.toDate}</div>
              <div className={styles.message}> message: {item.message}</div>
              <div className={styles.buttons}>
                <button onClick={(e) => onClickButton(e, item)} value={'accepted'}>Accept</button>
                <button onClick={(e) => onClickButton(e, item)} value={'rejected'}>Reject</button>
              </div>
            </div>
          )
        }) : <div className={styles.noRequests}>No requests by users</div>
      }
    </>
  )
}

export default AdminAttendances