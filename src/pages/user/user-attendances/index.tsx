import Navbar from '@/pages/navbar'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { requestTypeOptions, locationOptions, hoursOptions, minutesOptions, secondsOptions } from '../../../../config/dropdownOptions'
import { LOCALHOST_URL } from 'config/localhostUrl'
import { convertDateToTimeStamp, getFromStorage } from '@/utils'
import Calender from '@/pages/calender'

const UserAttendance = () => {

    const [userData, setUserData] = useState({ _id: '' });
    const [userAttendanceData, setUserAttendanceData] = useState({
        requestType: requestTypeOptions[0],
        fromDate: 0,
        toDate: 0,
        location: locationOptions[0],
        hours: hoursOptions[0],
        minutes: minutesOptions[0],
        seconds: secondsOptions[0],
        message: '',
        attendanceConfirmation: false,
        requestPending: true
    });
    const [submitStatus, setSubmitStatus] = useState(false);
    const [dateErrorMessage, setDateErrorMessage] = useState(false);

    useEffect(() => {
        setUserData(getFromStorage('USER_DATA'));

        const picker1: any = document.getElementById('date1');
        picker1.addEventListener('input', (e: any) => {
            var day = new Date(e.target.value).getUTCDay();
            if (day == 0 || day == 6) {
                e.target.value = '';
                setDateErrorMessage(true);
                return false;
            }
            setDateErrorMessage(false);
        });

        const picker2: any = document.getElementById('date2');
        picker2.addEventListener('input', (e: any) => {
            var day = new Date(e.target.value).getUTCDay();
            if (day == 0 || day == 6) {
                e.target.value = '';
                setDateErrorMessage(true);
                return false;
            }
            setDateErrorMessage(false);
        });
    }, [])

    var yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

    const submitDetails = async (e: any) => {
        e.preventDefault();
        let time: string = userAttendanceData.hours + ':' + userAttendanceData.minutes + ':' + userAttendanceData.seconds;
        const response = await fetch(`${LOCALHOST_URL}/attendanceRequest/postAttendances`, {
            method: 'POST',
            body: JSON.stringify({ userAttendanceData: { ...userAttendanceData, time: time, userId: userData._id } }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        await response.json()
        if (response.status === 201) {
            setSubmitStatus(true)
        }
    }

    const enableNextButton = (): Boolean => {
        return (
            userAttendanceData.fromDate !== 0 && userAttendanceData.toDate !== 0 && userAttendanceData.hours !== '00' && userAttendanceData.message !== ''
        )
    }

    return (
        <>
            <Navbar />
            <Calender />
            <div className={styles.attendanceRequests}>Attendance Requests</div>
            {dateErrorMessage &&
                <div className={styles.dateErrorMessage}>
                    Weekends are not allowed
                </div>
            }
            <form onSubmit={submitDetails} className={styles.attendanceForm}>
                <div className={styles.attendanceDropdowns}>
                    <div>
                        <label className={styles.inputTexts}>Requests type<span className={styles.asterisk}>* </span></label>
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
                        <label className={styles.inputTexts}>Location<span className={styles.asterisk}>* </span></label>
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
                    <label className={styles.inputTexts}>From Date<span className={styles.asterisk}>*</span></label>
                    <input id='date1'
                        type="date"
                        onChange={(e) => setUserAttendanceData({ ...userAttendanceData, fromDate: convertDateToTimeStamp(e.target.value) })}
                        max={yesterday}
                    />
                    <label className={styles.inputTexts}>To Date<span className={styles.asterisk}>*</span></label>
                    <input id='date2'
                        type="date"
                        onChange={(e) => setUserAttendanceData({ ...userAttendanceData, toDate: convertDateToTimeStamp(e.target.value) })}
                        max={yesterday}
                    />
                </div>
                <div className={styles.time}>
                    <label className={styles.inputTexts}>Time:<span className={styles.asterisk}>*</span></label>
                    <div className={styles.timeDropdown}>
                        <div>
                            <label className={styles.inputTexts}>Hours </label>
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
                            <label className={styles.inputTexts}>Minutes </label>
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
                            <label className={styles.inputTexts}>Seconds </label>
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
                    <label className={styles.inputTexts}>Message:<span className={styles.asterisk}>* </span></label>
                    <textarea className={styles.textarea}
                        placeholder='Enter your message here...'
                        onChange={(e) => setUserAttendanceData({ ...userAttendanceData, message: e.target.value })}
                    />
                </div>
                <div>
                    <button className={!enableNextButton() ? styles.submitBtnDisabled : styles.submitBtnEnabled} type='submit' disabled={!enableNextButton()}>Submit</button>
                </div>
            </form>

            {submitStatus && <div className={styles.yourRequest}>your request is submitted</div>}
        </>
    )
}

export default UserAttendance