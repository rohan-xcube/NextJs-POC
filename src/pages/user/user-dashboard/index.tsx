import Navbar from '@/pages/navbar'
import React from 'react'
import Image from 'next/image'
import styles from './index.module.css'
import Router from 'next/router';

const UserDashboard = () => {
  return (
    <>
      <Navbar />
      <div className={styles.icons}>
        <div>
          <Image
            src="/leave-request.png"
            alt='leaveRequest'
            width={60}
            height={60}
            onClick={() => Router.push('/user/user-leaves')}
            style={{ cursor: 'pointer' }}
          />
          <p className={styles.iconText}>leave</p>
        </div>
        <div>
          <Image
            src="/attendance-request.png"
            alt='attendanceRequest'
            width={60}
            height={60}
            onClick={() => Router.push('/user/user-attendances')}
            style={{ cursor: 'pointer' }}
          />
          <p className={styles.iconText}>attendance</p>
        </div>
      </div>
    </>
  )
}

export default UserDashboard