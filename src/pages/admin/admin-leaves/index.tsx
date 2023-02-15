import { LOCALHOST_URL } from 'config/localhostUrl'
import React, { useEffect, useState } from 'react'
import Navbar from '../../navbar'
import styles from './index.module.css'

const AdminLeaves = () => {

  const [userLeavesData, setUserLeavesData] = useState<any>({})

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(`${LOCALHOST_URL}/leaveRequest/getLeaves`, {
        method: 'GET'
      });
      const json = await response.json();
      setUserLeavesData(json.leavesData)
    } catch (error) {
      console.log("error", error);
    }
  };

  const onClickButton = async (e: any, userDetailsWithLeaveDetails: any) => {
    e.preventDefault()
    var leaveConfirmation = e.target.value
    const response = await fetch(`${LOCALHOST_URL}/leaveConfirmation/postLeavesConfirmation`, {
      method: 'POST',
      body: JSON.stringify({ LeaveDetails: { leaveConfirmation, userDetailsWithLeaveDetails } }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    console.log(data, 'data');

    (Object.values(userLeavesData).forEach((item1: any, index: any) => {
      if ((item1.email.toLowerCase() === userDetailsWithLeaveDetails.email.toLowerCase()) &&
        (item1.message.toLowerCase() === userDetailsWithLeaveDetails.message.toLowerCase())) {
        const deleteData = async () => {
          try {
            await fetch(`${LOCALHOST_URL}/leaveRequest/deleteLeaves?user_id=${item1?._id}`, {
              method: 'DELETE'
            });
            let selectedValue = userLeavesData
            selectedValue.splice(index, 1)
            setUserLeavesData(Object.values(selectedValue))
          } catch (error) {
            console.log("error", error);
          }
        }
        deleteData()
      }
    }))
  }

  console.log((userLeavesData), 'userLeavesData');

  return (
    <>
      <Navbar/>
      {Object.values(userLeavesData).length ?
        Object.values(userLeavesData).map((item: any, i: any) => {
          return (
            <div key={i} className={styles.leavesBox}>
              <div>{item.firstName} {item.lastName} requested leave(s) from {item.fromDate} to {item.toDate}</div>
              <div className={styles.message}> message: {item.message}</div>
              {item.attachmentFileObject ? (
                <div className={styles.attachments}>
                  <a download='attachment' href={item.attachmentFileObject} >click here to download attachment(s)</a>
                </div>
              ) : ''}
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

export default AdminLeaves