import React, { useState } from 'react'
import styles from './index.module.css'
import Router from 'next/router';
import { saveToStorage } from '@/utils';

const Login = () => {

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const submitDetails = async (e: any) => {
    e.preventDefault()
    const response = await fetch(`http://localhost:3000/api/userDetails/login`, {
      method: 'POST',
      body: JSON.stringify({ loginData }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    saveToStorage('USER_DATA', JSON.stringify(data.user))
    if (response.status === 201) {
      if (data.user.role === 'user') {
        Router.push('/user')
    } else if (data.user.role === 'admin' || data.user.role === 'superAdmin') {
        Router.push('/admin')
    }
    }
  }

  return (
    <>
      <h2 className={styles.login}>Login form</h2>
      <form onSubmit={submitDetails} className={styles.loginForm}>
        <div className={styles.formFields}>
          <label>Enter Email:</label>
          <input
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            type={'email'} />
        </div>
        <div className={styles.formFields}>
          <label>Enter password:</label>
          <input
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            type={'password'} />
        </div>
        <div>
          <button className={styles.loginBtn} type='submit'>Login</button>
        </div>
      </form>
      <div className={styles.bottomText}>
        <h4>Don't have an account?</h4>
        <h4 className={styles.signupText} onClick={() => Router.push('/registration')}>Signup</h4>
      </div>
    </>
  )
}

export default Login
