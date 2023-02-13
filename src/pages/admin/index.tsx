import { getFromStorage, removeFromStorage } from '@/utils'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

const Admin = () => {

  const [userData, setUserData] = useState({ firstName: '', lastName: '' })
  const [userLeavesData, setUserLeavesData] = useState<any>({})

  useEffect(() => {
    setUserData(getFromStorage('USER_DATA'))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/userDetails/getLeaves`, {
          method: 'GET'
        });
        const json = await response.json();
        setUserLeavesData(json.leavesData)
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [])

  const logoutBtn = () => {
    removeFromStorage('USER_DATA')
    Router.push('/')
  }

  const onClickButton = async (e: any, userDetailsWithLeaveDetails: any) => {
    e.preventDefault()
    var leaveConfirmation = e.target.value
    const response = await fetch(`http://localhost:3000/api/userDetails/postLeavesConfirmation`, {
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
        let selectedValue = userLeavesData
        selectedValue.splice(index, 1)
        setUserLeavesData(Object.values(selectedValue))
      }
    }))
  }

  console.log((userLeavesData), 'userLeavesData');

  return (
    <>
      <div>
        <ul className={styles.navBar}>
          <li className={styles.navBarList}>Admin</li>
          <li className={styles.navBarList} onClick={logoutBtn}>Logout</li>
        </ul>
      </div>
      <div>Welcome {userData?.firstName + ' ' + userData?.lastName}</div>

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
                <button onClick={(e) => onClickButton(e, item)} value={'declined'}>decline</button>
              </div>
            </div>
          )
        }) : <div className={styles.noRequests}>No requests by users</div>
      }
    </>
  )
}

export default Admin