import { getFromStorage, removeFromStorage } from '@/utils'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { useRouter } from 'next/router';

const Navbar = () => {

    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', role: '' })

    const router = useRouter();

    useEffect(() => {
        setUserData(getFromStorage('USER_DATA'))
    }, [])

    const logoutBtn = () => {
        removeFromStorage('USER_DATA')
        router.push('/');
    };

    const HomeBtn = () => {
        if (userData?.role === 'user') {
            router.push('/user/user-dashboard');
        } else if (userData?.role === 'admin') {
            router.push('/admin/admin-dashboard');
        }
    };

    return (
        <>
            <div className={styles.navBarParent}>
                <ul className={styles.navBar}>
                    {!router.asPath.includes('dashboard') && <li className={styles.navBarLeftList} onClick={HomeBtn}>Home</li>}
                    <li className={styles.navBarList} onClick={logoutBtn}>Logout</li>
                    <li className={styles.navBarList}>{userData?.role}</li>
                </ul>
            </div>
            {router.asPath.includes('dashboard') && <div className={styles.welcomeUserName}>Welcome, {userData?.firstName + ' ' + userData?.lastName}</div>}
        </>
    )
}

export default Navbar