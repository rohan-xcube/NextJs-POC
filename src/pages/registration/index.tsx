import React, { useState } from 'react'
import styles from './index.module.css'
import Router from 'next/router';
import { saveToStorage } from '@/utils';
import { LOCALHOST_URL } from 'config/localhostUrl';

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
        const response = await fetch(`${LOCALHOST_URL}/signup/signup`, {
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
                Router.push('/user/user-dashboard')
            } else if (userData.role === 'admin' || userData.role === 'superAdmin') {
                Router.push('/admin/admin-dashboard')
            }
        }
    }

    const enableNextButton = (): Boolean => {
        return (
            userData.firstName !== '' && userData.lastName !== '' && userData.email !== '' && userData.password !== '' && userData.role !== ''
        )
    }

    return (
        <>
            <h2 className={styles.registration}>Registration Form</h2>
            <form onSubmit={submitDetails} className={styles.registrationForm}>
                <div className={styles.formFields}>
                    <label className={styles.inputTexts}>Enter First name:<span className={styles.asterisk}>* </span></label>
                    <input
                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                        type={'text'} />
                </div>
                <div className={styles.formFields}>
                    <label className={styles.inputTexts}>Enter Last name:<span className={styles.asterisk}>* </span></label>
                    <input
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                        type={'text'} />
                </div>
                <div className={styles.formFields}>
                    <label className={styles.inputTexts}>Enter Email:<span className={styles.asterisk}>* </span></label>
                    <input
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        type={'email'} />
                </div>
                <div className={styles.formFields}>
                    <label className={styles.inputTexts}>Enter password:<span className={styles.asterisk}>* </span></label>
                    <input
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        type={'password'} />
                </div>
                <div className={styles.formFields}>
                    <label className={styles.inputTexts}>Please select any one role:<span className={styles.asterisk}>* </span></label>
                    <div className={styles.radioButtons}>
                        <div>
                            <input type={'radio'} value={'user'} name='role' onChange={(e) => setUserData({ ...userData, role: e.target.value })} readOnly /> <label className={styles.inputTexts}>User</label>
                        </div>
                        <div>
                            <input type={'radio'} value={'admin'} name='role' onChange={(e) => setUserData({ ...userData, role: e.target.value })} readOnly /> <label className={styles.inputTexts}>Admin</label>
                        </div>
                        <div>
                            <input type={'radio'} value={'superAdmin'} name='role' onChange={(e) => setUserData({ ...userData, role: e.target.value })} readOnly /> <label className={styles.inputTexts}>Super Admin</label>
                        </div>
                    </div>
                </div>
                <div>
                    <button className={!enableNextButton() ? styles.submitBtnDisabled : styles.submitBtnEnabled} type='submit' disabled={!enableNextButton()}>Submit</button>
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