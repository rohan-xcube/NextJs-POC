import { convertDateToTimeStamp, convertTimeStampToDate, getFromStorage } from '@/utils';
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { LOCALHOST_URL } from 'config/localhostUrl';
import Navbar from '../../navbar';

const UserLeaves = () => {

    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', _id: '' })
    const [userLeaveData, setUserLeaveData] = useState<ApplyLeaveDetails>({
        fromDate: 0,
        toDate: 0,
        message: '',
        attachmentFileObject: null,
        leaveConfirmation: false,
        requestPending: true
    })
    const [submitStatus, setSubmitStatus] = useState(false)

    useEffect(() => {
        setUserData(getFromStorage('USER_DATA'))
    }, [])

    const onChangeFileInput = (e: any) => {
        let files = e.target.files
        let reader = new FileReader();
        reader.readAsDataURL(files[0])
        reader.onload = (e) => {
            setUserLeaveData({ ...userLeaveData, attachmentFileObject: e.target?.result })
        }
    }

    const submitDetails = async (e: any) => {
        e.preventDefault();
        const response = await fetch(`${LOCALHOST_URL}/leaveRequest/postLeaves`, {
            method: 'POST',
            body: JSON.stringify({ userLeaveData: { ...userLeaveData, userId: userData._id } }),
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
            userLeaveData.fromDate !== 0 && userLeaveData.toDate !== 0 && userLeaveData.message !== ''
        )
    }

    return (
        <>
            <Navbar />
            <div className={styles.leavesRequests}>
                Leaves Requests
            </div>

            <form onSubmit={submitDetails} className={styles.leaveForm}>
                <div className={styles.dates}>
                    <label className={styles.inputTexts}>From Date<span className={styles.asterisk}>* </span></label>
                    <input
                        type="date"
                        onChange={(e) => setUserLeaveData({ ...userLeaveData, fromDate: convertDateToTimeStamp(e.target.value) })}
                    />
                    <label className={styles.inputTexts}>To Date<span className={styles.asterisk}>* </span></label>
                    <input
                        type="date"
                        onChange={(e) => setUserLeaveData({ ...userLeaveData, toDate: convertDateToTimeStamp(e.target.value) })}
                        min={convertTimeStampToDate(userLeaveData?.fromDate)}
                    />
                </div>
                <div className={styles.messageBox}>
                    <label className={styles.inputTexts}>Message:<span className={styles.asterisk}>* </span></label>
                    <textarea className={styles.textarea}
                        placeholder='Enter your message here...'
                        onChange={(e) => setUserLeaveData({ ...userLeaveData, message: e.target.value })}
                    />
                </div>
                <div className={styles.attachments}>
                    <label className={styles.inputTexts}>Attachments: </label>
                    <input
                        type={'file'}
                        onChange={onChangeFileInput}
                    />
                </div>
                <div>
                    <button className={!enableNextButton() ? styles.submitBtnDisabled : styles.submitBtnEnabled} type='submit'
                        disabled={!enableNextButton()}>Submit</button>
                </div>
            </form>

            {submitStatus && <div className={styles.yourRequest}>your request is submitted</div>}
        </>
    )
}

export default UserLeaves