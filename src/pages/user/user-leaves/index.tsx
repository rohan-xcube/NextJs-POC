import { getFromStorage } from '@/utils';
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { LOCALHOST_URL } from 'config/localhostUrl';
import Navbar from '../../navbar';

const UserLeaves = () => {

    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' })
    const [userLeaveData, setUserLeaveData] = useState<ApplyLeaveDetails>({
        fromDate: '',
        toDate: '',
        message: '',
        attachmentFileObject: null
    })
    const [leaveConfirmation, setLeaveConfirmation] = useState<any>({})
    const [submitStatus, setSubmitStatus] = useState(false)

    useEffect(() => {
        setUserData(getFromStorage('USER_DATA'))
    }, [])

    useEffect(() => {
        fetchData();
    }, [userData])

    const fetchData = async () => {
        try {
            const response = await fetch(`${LOCALHOST_URL}/leaveConfirmation/getLeavesConfirmation?user_email=${userData.email}`, {
                method: 'GET'
            });
            const json = await response.json();
            setLeaveConfirmation(json.leavesData)
        } catch (error) {
            console.log("error", error);
        }
    };

    var today = new Date().toISOString().split('T')[0];

    var disableMinDate = userLeaveData?.fromDate?.toString().split('T')[0];

    const onChangeFileInput = (e: any) => {
        let files = e.target.files
        let reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload = (e) => {
            setUserLeaveData({ ...userLeaveData, attachmentFileObject: e.target?.result })
        }
    }

    const submitDetails = async (e: any) => {
        e.preventDefault()
        const response = await fetch(`${LOCALHOST_URL}/leaveRequest/postLeaves`, {
            method: 'POST',
            body: JSON.stringify({ userLeaveData: { ...userLeaveData, firstName: userData.firstName, lastName: userData.lastName, email: userData.email } }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        await response.json()
        if(response.status === 201) {
            setSubmitStatus(true)
        }
    }

    const leaveRequestStatus = () => {
        if (leaveConfirmation?.leaveConfirmation === 'accepted') {
            return (
                <div className={styles.leaveAccepted}>your leave requested is accepted.</div>
            )
        } else if (leaveConfirmation?.leaveConfirmation === 'rejected') {
            return (
                <div className={styles.leaveRejected}>your leave request is rejected.</div>
            )
        } else if (!leaveConfirmation) {
            return (
                <div className={styles.noPending}>you dont have any pending leave requests.</div>
            )
        }
    }

    return (
        <>
            <Navbar/>
            <div className={styles.leavesRequests}>
                Leaves Requests
            </div>

            {leaveRequestStatus()}

            <form onSubmit={submitDetails} className={styles.registrationForm}>
                <div className={styles.dates}>
                    <label>From Date</label>
                    <input
                        type="date"
                        onChange={(e) => setUserLeaveData({ ...userLeaveData, fromDate: e.target.value })}
                        min={today}
                    />
                    <label>To Date</label>
                    <input
                        type="date"
                        onChange={(e) => setUserLeaveData({ ...userLeaveData, toDate: e.target.value })}
                        min={disableMinDate}
                    />
                </div>
                <div className={styles.messageBox}>
                    <label>Message: </label>
                    <textarea className={styles.textarea}
                        placeholder='Enter your message here...'
                        onChange={(e) => setUserLeaveData({ ...userLeaveData, message: e.target.value })}
                    />
                </div>
                <div className={styles.attachments}>
                    <label>Attachments: </label>
                    <input
                        type={'file'}
                        onChange={onChangeFileInput}
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

export default UserLeaves