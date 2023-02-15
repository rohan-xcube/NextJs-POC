import Navbar from '@/pages/navbar'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { requestTypeOptions, locationOptions, hoursOptions, minutesOptions, secondsOptions } from '../../../../config/dropdownOptions'
import { LOCALHOST_URL } from 'config/localhostUrl'
import { getFromStorage } from '@/utils'

const UserAttendance = () => {

    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' })
    const [userAttendanceData, setUserAttendanceData] = useState({
        requestType: requestTypeOptions[0],
        fromDate: '',
        toDate: '',
        location: locationOptions[0],
        hours: hoursOptions[0],
        minutes: minutesOptions[0],
        seconds: secondsOptions[0],
        message: ''
    })
    const [attendanceConfirmation, setAttendanceConfirmation] = useState<any>({})
    const [submitStatus, setSubmitStatus] = useState(false)

    useEffect(() => {
        setUserData(getFromStorage('USER_DATA'))
    }, [])

    useEffect(() => {
        fetchData();
    }, [userData])

    // console.log(userData, 'userData')

    const fetchData = async () => {
        try {
            const response = await fetch(`${LOCALHOST_URL}/attendanceConfirmation/getAttendancesConfirmation?user_email=${userData.email}`, {
                method: 'GET'
            });
            const json = await response.json();
            setAttendanceConfirmation(json.attendancesData)
        } catch (error) {
            console.log("error", error);
        }
    };


    var yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

    const submitDetails = async (e: any) => {
        e.preventDefault()
        let time: String = userAttendanceData.hours + ':' + userAttendanceData.minutes + ':' + userAttendanceData.seconds
        const response = await fetch(`${LOCALHOST_URL}/attendanceRequest/postAttendances`, {
            method: 'POST',
            body: JSON.stringify({ userAttendanceData: { ...userAttendanceData, time: time, firstName: userData.firstName, lastName: userData.lastName, email: userData.email } }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        await response.json()
        if (response.status === 201) {
            setSubmitStatus(true)
        }
    }

    const attendanceRequestStatus = () => {
        if (attendanceConfirmation?.attendanceConfirmation === 'accepted') {
            return (
                <div className={styles.attendanceAccepted}>your attendance requested is accepted.</div>
            )
        } else if (attendanceConfirmation?.attendanceConfirmation === 'rejected') {
            return (
                <div className={styles.attendanceRejected}>your attendance request is rejected.</div>
            )
        }  else if (!attendanceConfirmation) {
            return (
                <div className={styles.noPending}>you dont have any pending attendance requests.</div>
            )
        }
    }

    console.log(attendanceConfirmation, "attendanceConfirmation");

    return (
        <>
            <Navbar />
            <div className={styles.attendanceRequests}>Attendance requests</div>

            {attendanceRequestStatus()}

            <form onSubmit={submitDetails} className={styles.attendanceForm}>
                <div className={styles.attendanceDropdowns}>
                    <div>
                        <label>Requests type</label>
                        <select
                            onChange={e => setUserAttendanceData({ ...userAttendanceData, requestType: e.target.value })}>
                            {requestTypeOptions.map((value, i) => (
                                <option value={value} key={i}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Location</label>
                        <select
                            onChange={e => setUserAttendanceData({ ...userAttendanceData, location: e.target.value })}>
                            {locationOptions.map((value, i) => (
                                <option value={value} key={i}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.dates}>
                    <label>From Date</label>
                    <input
                        type="date"
                        onChange={(e) => setUserAttendanceData({ ...userAttendanceData, fromDate: e.target.value })}
                        max={yesterday}
                    />
                    <label>To Date</label>
                    <input
                        type="date"
                        onChange={(e) => setUserAttendanceData({ ...userAttendanceData, toDate: e.target.value })}
                        max={yesterday}
                    />
                </div>
                <div className={styles.time}>
                    <label>Time:</label>
                    <div className={styles.timeDropdown}>
                        <div>
                            <label>Hours</label>
                            <select
                                onChange={e => setUserAttendanceData({ ...userAttendanceData, hours: e.target.value })}>
                                {hoursOptions.map((value, i) => (
                                    <option value={value} key={i}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Minutes</label>
                            <select
                                onChange={e => setUserAttendanceData({ ...userAttendanceData, minutes: e.target.value })}>
                                {minutesOptions.map((value, i) => (
                                    <option value={value} key={i}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Seconds</label>
                            <select
                                onChange={e => setUserAttendanceData({ ...userAttendanceData, seconds: e.target.value })}>
                                {secondsOptions.map((value, i) => (
                                    <option value={value} key={i}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className={styles.messageBox}>
                    <label>Message: </label>
                    <textarea className={styles.textarea}
                        placeholder='Enter your message here...'
                        onChange={(e) => setUserAttendanceData({ ...userAttendanceData, message: e.target.value })}
                    />
                </div>
                <div>
                    <button className={styles.submitBtn} type='submit'>Submit</button>
                </div>
            </form>

            {submitStatus && <div className={styles.yourRequest}>your request is submitted</div>}
        </>
    )
}

export default UserAttendance