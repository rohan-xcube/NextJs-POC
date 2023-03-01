import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import Image from 'next/image'
import { DAYS, MONTHS } from '../../../config/calenderOptions'
import { areDatesTheSame, dateRange, getDateObj, getDaysInMonth, getSortedDays, range } from '@/utils'

const Calender = (props: ICalenderProps) => {

    const startingDate = new Date()
    const [currentMonth, setCurrentMonth] = useState(startingDate.getMonth())
    const [currentYear, setCurrentYear] = useState(startingDate.getFullYear())
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)

    const prevMonth = () => {
        if (currentMonth > 0) {
            setCurrentMonth((prev) => prev - 1);
        } else {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1)
        }
    }

    const nextMonth = () => {
        if (currentMonth < 11) {
            setCurrentMonth((prev) => prev + 1);
        } else {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1)
        }
    }

    const attendanceDataRange = () => {
        let temp1: any = [];
        let temp2: any = [];
        if (props?.attendanceData && props?.attendanceData.length) {
            props.attendanceData.filter((item: any) => !item.requestPending).map((item2: any) => {
                let fromDate = item2.fromDate
                let toDate = item2.toDate
                let range = dateRange(fromDate, toDate)
                temp1.push(range)
            })
        }
        let dateData = Array.prototype.concat.apply([], temp1);
        dateData?.map((item2: any) => {
            let date = new Date(item2);
            let dd = date.getDate();
            let mm = date.getMonth();
            let yyyy = date.getFullYear();
            temp2.push({ selectedDates: new Date(yyyy, mm, dd) })
        })
        return temp2;
    }

    const leaveDataRange = () => {
        let temp1: any = [];
        let temp2: any = [];
        if (props?.leaveData && props?.leaveData.length) {
            props.leaveData.filter((item: any) => !item.requestPending).map((item2: any) => {
                let fromDate = item2.fromDate
                let toDate = item2.toDate
                let range = dateRange(fromDate, toDate)
                temp1.push(range)
            })
        }
        let dateData = Array.prototype.concat.apply([], temp1);
        dateData?.map((item2: any) => {
            let date = new Date(item2);
            let dd = date.getDate();
            let mm = date.getMonth();
            let yyyy = date.getFullYear();
            temp2.push({ selectedDates: new Date(yyyy, mm, dd) })
        })
        return temp2;
    }

    const checkGivenDateIsInRangeForLeaves = (givenDate: any): String => {
        let temp = '';
        var dateOffset = (24 * 60 * 60 * 1000) * 1;
        if (props?.leaveData && props?.leaveData.length) {
            props.leaveData.filter((item: any) => !item.requestPending).map((item2: any) => {
                let fromDate = item2.fromDate
                let toDate = item2.toDate
                if (((givenDate.getTime() >= fromDate) || ((givenDate.getTime() + dateOffset) >= fromDate)) &&
                    ((givenDate.getTime() <= toDate) || ((givenDate.getTime() + dateOffset) <= toDate))) {
                    if (item2.leaveConfirmation) {
                        return temp = 'leave accepted'
                    }
                    else if (!item2.leaveConfirmation) {
                        return temp = 'leave rejected'
                    }
                }
            })
        }
        return temp;
    }

    const checkGivenDateIsInRangeForAttendances = (givenDate: any): String => {
        let temp = '';
        var dateOffset = (24 * 60 * 60 * 1000) * 1;
        if (props?.attendanceData && props?.attendanceData.length) {
            props.attendanceData.filter((item: any) => !item.requestPending).map((item2: any) => {
                let fromDate = item2.fromDate
                let toDate = item2.toDate
                if (((givenDate.getTime() >= fromDate) || ((givenDate.getTime() + dateOffset) >= fromDate)) &&
                    ((givenDate.getTime() <= toDate) || ((givenDate.getTime() + dateOffset) <= toDate))) {
                    if (item2.attendanceConfirmation) {
                        return temp = 'attendance accepted'
                    }
                    else if (!item2.attendanceConfirmation) {
                        return temp = 'attendance rejected'
                    }
                }
            })
        }
        return temp;
    }

    return (
        <>
            <div className={styles.box}>
                <div className={styles.wrapper}>
                    <div className={styles.calenderHead}>
                        <Image
                            src="/left-arrow.png"
                            alt='attendanceRequest'
                            width={20}
                            height={20}
                            style={{ cursor: 'pointer', backgroundColor: 'white' }}
                            onClick={prevMonth}
                        />
                        {MONTHS[currentMonth]} {currentYear}
                        <Image
                            src="/right-arrow.png"
                            alt='attendanceRequest'
                            width={20}
                            height={20}
                            style={{ cursor: 'pointer', backgroundColor: 'white' }}
                            onClick={nextMonth}
                        />
                    </div>
                    <div className={styles.sevenColumnGrid}>
                        {getSortedDays(currentMonth, currentYear).map((day, i) => {
                            return (
                                <div className={styles.headDay} key={i}>
                                    {day}
                                </div>
                            )
                        })}
                    </div>
                    <div className={daysInMonth === 28 ? styles.caldenderFebBody : styles.caldenderBody}>
                        {range(daysInMonth).map((day, i) => {
                            return (
                                <div className={areDatesTheSame(new Date(), getDateObj(day, currentMonth, currentYear)) ? styles.styledActiveDay : styles.styledDay}
                                    key={i}>
                                    {day}
                                    {
                                        attendanceDataRange()?.map((ev: any, i: any) => {
                                            return (
                                                areDatesTheSame(
                                                    getDateObj(day, currentMonth, currentYear),
                                                    ev.selectedDates
                                                )
                                                &&
                                                <div className={checkGivenDateIsInRangeForAttendances(ev.selectedDates).includes('rejected') ? styles.styledEventRejected : styles.styledEventAccepted} key={i}>
                                                    {checkGivenDateIsInRangeForAttendances(ev.selectedDates)}
                                                </div>
                                            )
                                        }
                                        )
                                    }
                                    {
                                        leaveDataRange()?.map((ev: any, i: any) => {
                                            return (
                                                areDatesTheSame(
                                                    getDateObj(day, currentMonth, currentYear),
                                                    ev.selectedDates
                                                )
                                                &&
                                                <div className={checkGivenDateIsInRangeForLeaves(ev.selectedDates).includes('rejected') ? styles.styledEventRejected : styles.styledEventAccepted} key={i}>
                                                    {checkGivenDateIsInRangeForLeaves(ev.selectedDates)}
                                                </div>
                                            )
                                        }
                                        )
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Calender