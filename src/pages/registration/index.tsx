import React, { useState } from 'react'
import styles from './index.module.css'
import Router from 'next/router';
import { saveToStorage } from '@/utils';

const Registration = () => {

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: ''
    })

    const submitDetails = async (e: any) => {
        e.preventDefault()
        const response = await fetch(`http://localhost:3000/api/userDetails/signup`, {
            method: 'POST',
            body: JSON.stringify({ userData }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        saveToStorage('USER_DATA', JSON.stringify(data))
        if (response.status === 201) {
            if (userData.role === 'user') {
                Router.push('/user')
            } else if (userData.role === 'admin' || userData.role === 'superAdmin') {
                Router.push('/admin')
            }
        }
    }

    return (
        <>
            <h2 className={styles.registration}>Registration form</h2>
            <form onSubmit={submitDetails} className={styles.registrationForm}>
                <div className={styles.formFields}>
                    <label>Enter First name:</label>
                    <input
                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                        type={'text'} />
                </div>
                <div className={styles.formFields}>
                    <label>Enter Last name:</label>
                    <input
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                        type={'text'} />
                </div>
                <div className={styles.formFields}>
                    <label>Enter Email:</label>
                    <input
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        type={'email'} />
                </div>
                <div className={styles.formFields}>
                    <label>Enter password:</label>
                    <input
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        type={'password'} />
                </div>
                <div className={styles.formFields}>
                    <label>Please select any one role:</label>
                    <input type={'radio'} value={'user'} name='role' onChange={(e) => setUserData({ ...userData, role: e.target.value })} readOnly /> User
                    <input type={'radio'} value={'admin'} name='role' onChange={(e) => setUserData({ ...userData, role: e.target.value })} readOnly /> Admin
                    <input type={'radio'} value={'superAdmin'} name='role' onChange={(e) => setUserData({ ...userData, role: e.target.value })} readOnly /> Super Admin
                </div>
                <div>
                    <button className={styles.submitBtn} type='submit'>Submit</button>
                </div>
            </form>
            <div className={styles.bottomText}>
                <h4>Already a user?</h4>
                <h4 className={styles.loginText} onClick={() => Router.push('/login')}>Login</h4>
            </div>
        </>
    )
}

export default Registration