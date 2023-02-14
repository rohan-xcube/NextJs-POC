import { getFromStorage, removeFromStorage } from '@/utils'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import Router from 'next/router';

const Navbar = () => {

    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', role: '' })

    useEffect(() => {
        setUserData(getFromStorage('USER_DATA'))
    }, [])

    const logoutBtn = () => {
        removeFromStorage('USER_DATA')
        Router.push('/')
    }

    return (
        <>
            <div>
                <ul className={styles.navBar}>
                    <li className={styles.navBarList}>{userData?.role}</li>
                    <li className={styles.navBarList} onClick={logoutBtn}>Logout</li>
                </ul>
            </div>
            <div>Welcome {userData?.firstName + ' ' + userData?.lastName}</div></>
    )
}

export default Navbar