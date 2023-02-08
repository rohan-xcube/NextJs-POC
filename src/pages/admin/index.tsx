import { getFromStorage, removeFromStorage } from '@/utils'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

const Admin = () => {

  const [userData, setUserData] = useState({firstName: '', lastName: '' })

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
          console.log(json.leavesData);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchData();
    })

    const logoutBtn = () => {
        removeFromStorage('USER_DATA')
        Router.push('/')
    }

  return (
    <>
      <div>
        <ul className={styles.navBar}>
          <li className={styles.navBarList}>Admin</li>
          <li className={styles.navBarList} onClick={logoutBtn}>Logout</li>
        </ul>
      </div>
      <div>Welcome {userData?.firstName + ' ' + userData?.lastName}</div>
    </>
  )
}

export default Admin