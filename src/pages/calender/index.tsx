import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import Image from 'next/image'
import { DAYS, MONTHS } from '../../../config/calenderOptions'
import { areDatesTheSame, convertDateToTimeStamp, convertTimeStampToString, dateRange, daysInMonth, getDateObj, getFromStorage, getSortedDays, isWeekday } from '@/utils'
import Holidays from '../../../jsons/holidays.json'
import { LOCALHOST_URL } from 'config/localhostUrl'

const Calender = () => {

    const startingDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(startingDate.getMonth());
    const [currentYear, setCurrentYear] = useState(startingDate.getFullYear());
    const [userData, setUserData] = useState({ _id: '' });
    const [attendanceConfirmation, setAttendanceConfirmation] = useState<any>({});
    const [leaveConfirmation, setLeaveConfirmation] = useState<any>({});

    useEffect(() => {
        setUserData(getFromStorage('USER_DATA'));
    }, [])

    useEffect(() => {
        fetchAttendanceData();
        fetchLeavesData();
    }, [userData._id, MONTHS[currentMonth], currentYear]);

    // useEffect(() => {
    //     fetchHolidaysData();
    // }, [currentYear]);

    const fetchAttendanceData = async () => {
        try {
            const response = await fetch(`${LOCALHOST_URL}/attendanceRequest/getAttendancesById?userId=${userData._id}&month=${MONTHS[currentMonth]}&year=${currentYear}`, {
                method: 'GET'
            });
            const json = await response.json();
            setAttendanceConfirmation(json.AttendanceDataPerMonth)
        } catch (error) {
            console.log("error", error);
        }
    };

    const fetchLeavesData = async () => {
        try {
            const response = await fetch(`${LOCALHOST_URL}/leaveRequest/getLeavesById?userId=${userData._id}&month=${MONTHS[currentMonth]}&year=${currentYear}`, {
                method: 'GET'
            });
            const json = await response.json();
            setLeaveConfirmation(json.leavesDataPerMonth)
        } catch (error) {
            console.log("error", error);
        }
    };

    // const fetchHolidaysData = async () => {
    //     try {
    //         const response = await fetch(`${LOCALHOST_URL}/holidaysRequest/getHolidaysByYear?year=${currentYear}`, {
    //             method: 'GET'
    //         });
    //         const json = await response.json();
    //         setLeaveConfirmation(json.leavesDataPerMonth)
    //     } catch (error) {
    //         console.log("error", error);
    //     }
    // };

    const prevMonth = () => {
        if (currentMonth > 0) {
            setCurrentMonth((prev) => prev - 1);
        } else {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1);
        }
    }

    const nextMonth = () => {
        if (currentMonth < 11) {
            setCurrentMonth((prev) => prev + 1);
        } else {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        }
    }

    const attendanceDataRange = () => {
        let temp1: any = [];
        let temp2: any = [];
        if (attendanceConfirmation && attendanceConfirmation.length) {
            attendanceConfirmation.filter((item: any) => !item.requestPending).map((item2: any) => {
                let fromDate = item2.fromDate;
                let toDate = item2.toDate;
                let range = dateRange(fromDate, toDate);
                temp1.push(range);
            })
        }
        let dateData = Array.prototype.concat.apply([], temp1);
        dateData.filter((item3: any) => !(item3).toLowerCase().includes('sat'))
            .filter((item4: any) => !(item4).toLowerCase().includes('sun'))
            .filter((item5: any) => (item5).toLowerCase().includes(MONTHS[currentMonth].toLowerCase()))?.map((item6: any) => {
                let date = new Date(item6);
                let dd = date.getDate();
                let mm = date.getMonth();
                let yyyy = date.getFullYear();
                temp2.push({ selectedDates: new Date(yyyy, mm, dd) });
            })
        return temp2;
    }

    const leaveDataRange = () => {
        let temp1: any = [];
        let temp2: any = [];
        if (leaveConfirmation && leaveConfirmation.length) {
            leaveConfirmation.filter((item: any) => !item.requestPending).map((item2: any) => {
                let fromDate = item2.fromDate;
                let toDate = item2.toDate;
                let range = dateRange(fromDate, toDate);
                temp1.push(range);
            })
        }
        // Thu Jan 26 2023 00:00:00 GMT+0530 (India Standard Time) json object
        // Wed, 05 Apr 2023 00:00:00 GMT filtered data
        // ( Holidays.HOLIDAYS_2023.map((item: any) => console.log(item.Date)), 'holidays')
        let dateData = Array.prototype.concat.apply([], temp1);
        dateData.filter((item3: any) => !(item3).toLowerCase().includes('sat'))
            .filter((item4: any) => !(item4).toLowerCase().includes('sun'))
            .filter((item5: any) => (item5).toLowerCase().includes(MONTHS[currentMonth].toLowerCase()))
            // .filter((item6:any) => console.log(item6))
            ?.map((item6: any) => {
                let date = new Date(item6);
                let dd = date.getDate();
                let mm = date.getMonth();
                let yyyy = date.getFullYear();
                temp2.push({ selectedDates: new Date(yyyy, mm, dd) });
            })
        return temp2;
    }

    const checkGivenDateIsInRangeForLeaves = (givenDate: any): String => {
        let temp = '';
        var dateOffset = (24 * 60 * 60 * 1000) * 1;
        if (leaveConfirmation && leaveConfirmation.length) {
            leaveConfirmation.filter((item: any) => !item.requestPending).map((item2: any) => {
                let fromDate = item2.fromDate;
                let toDate = item2.toDate;
                if (((givenDate.getTime() >= fromDate) || ((givenDate.getTime() + dateOffset) >= fromDate)) &&
                    ((givenDate.getTime() <= toDate) || ((givenDate.getTime() + dateOffset) <= toDate))) {
                    if (item2.leaveConfirmation) {
                        return temp = 'leave request accepted';
                    }
                    else if (!item2.leaveConfirmation) {
                        return temp = 'leave request rejected';
                    }
                }

            })
        }
        return temp;
    }

    const checkGivenDateIsInRangeForAttendances = (givenDate: any): String => {
        let temp = '';
        var dateOffset = (24 * 60 * 60 * 1000) * 1;
        if (attendanceConfirmation && attendanceConfirmation.length) {
            attendanceConfirmation.filter((item: any) => !item.requestPending).map((item2: any) => {
                let fromDate = item2.fromDate;
                let toDate = item2.toDate;
                if (((givenDate.getTime() >= fromDate) || ((givenDate.getTime() + dateOffset) >= fromDate)) &&
                    ((givenDate.getTime() <= toDate) || ((givenDate.getTime() + dateOffset) <= toDate))) {
                    if (item2.attendanceConfirmation) {
                        return temp = 'attendance request accepted';
                    }
                    else if (!item2.attendanceConfirmation) {
                        return temp = 'attendance request rejected';
                    }
                }
            })
        }
        return temp;
    }

    const avgWorkTime = (): any => {
        let arr1: any = [];
        let givenSeconds = 0;
        let avgTimeInSeconds = 0;
        if (attendanceConfirmation && attendanceConfirmation?.length) {
            attendanceConfirmation.filter((item: any) => !item.requestPending)
                .filter((item2: any) => item2.attendanceConfirmation)
                .map((item3: any) => {
                    var time = item3.time;
                    var array = time.split(":");
                    givenSeconds = (parseInt(array[0], 10) * 60 * 60) + (parseInt(array[1], 10) * 60) + parseInt(array[2], 10);
                    arr1.push(givenSeconds);
                })
            const total = arr1.reduce((acc: any, c: any) => acc + c, 0);
            avgTimeInSeconds = total / arr1.length;
            let d = Number(avgTimeInSeconds);
            if (d <= 0 || total <= 0) {
                return '00:00:00';
            } else {
                let h = Math.floor(d / 3600);
                let m = Math.floor(d % 3600 / 60);
                let s = Math.floor(d % 3600 % 60);
                let hDisplay = h <= 9 ? '0' + h + ':' : h + ":";
                let mDisplay = m <= 9 ? '0' + m + ':' : m + ":";
                let sDisplay = s <= 9 ? '0' + s : s;
                return hDisplay + mDisplay + sDisplay;
            }
        } else {
            return '00:00:00';
        }
    };

    const workingDaysOfSelectedMonth = (): number => {
        var weekdays = 0;
        var days = daysInMonth(currentMonth, currentYear);
        for (var i = 0; i < days; i++) {
            if (isWeekday(currentYear, currentMonth, i + 1))
                weekdays++;
        }
        return weekdays;
    }

    const getCountOfAttendances = () => {
        let temp1: any = [];
        let countOfAcceptedAttendances = 0;
        let countOfRejectedAttendances = 0;
        var dateOffset = (24 * 60 * 60 * 1000) * 1;
        if (attendanceConfirmation && attendanceConfirmation.length) {
            attendanceConfirmation.filter((item: any) => !item.requestPending).forEach((item2: any) => {
                let fromDate = item2.fromDate;
                let toDate = item2.toDate;
                if ((!convertTimeStampToString(fromDate).toLowerCase().includes(MONTHS[currentMonth].toLowerCase())) || (!convertTimeStampToString(toDate).toLowerCase().includes(MONTHS[currentMonth].toLowerCase()))) {
                    let range = dateRange(fromDate, toDate);
                    temp1.push(range);
                    let dateData = Array.prototype.concat.apply([], temp1);
                    let filteredData = dateData.filter((item1: any) => !(item1).toLowerCase().includes('sat'))
                        .filter((item2: any) => !(item2).toLowerCase().includes('sun'))
                        .filter((item3: any) => (item3).toLowerCase().includes(MONTHS[currentMonth].toLowerCase()))
                    fromDate = convertDateToTimeStamp(filteredData[0]);
                    toDate = convertDateToTimeStamp(filteredData[filteredData.length - 1]);
                }
                let differenceMs = Math.abs(toDate - fromDate);
                let acceptedAttendances = Math.round(differenceMs / dateOffset);
                let rejectedAttendances = Math.round(differenceMs / dateOffset);
                if (item2.attendanceConfirmation) {
                    countOfAcceptedAttendances += acceptedAttendances;
                }
                if (!item2.attendanceConfirmation) {
                    countOfRejectedAttendances += rejectedAttendances;
                }
            })
        }
        return {
            countOfAcceptedAttendances: countOfAcceptedAttendances ? countOfAcceptedAttendances + 1 : 0,
            countOfRejectedAttendances: countOfRejectedAttendances ? countOfRejectedAttendances + 1 : 0
        };
    }

    const workingDaysOfRemaningDays = (): any => {
        var weekdays = 0;
        var date = new Date();
        var time = new Date(date.getTime());
        time.setMonth(date.getMonth() + 1);
        time.setDate(0);
        if (convertTimeStampToString(convertDateToTimeStamp(startingDate)).toLowerCase().includes(MONTHS[currentMonth].toLowerCase())) {
            var days = time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;
            for (var i = 0; i < days; i++) {
                if (isWeekday(currentYear, currentMonth, i + 1))
                    weekdays++;
            }
            return weekdays + 1;
        } else {
            return 0;
        }
    }

    const isHolidayInCurrentMonth = (): number => {
        let countOfHolidays = 0;
        Holidays.HOLIDAYS_2023?.map((ev: any) => {
            let holidayDates = new Date(ev.Date);
            if ((convertTimeStampToString(holidayDates).toLowerCase().includes(MONTHS[currentMonth].toLowerCase()))) {
                countOfHolidays = countOfHolidays + 1;
            }
        })
        return countOfHolidays;
    }

    const avgLeaveDays = (): number => {
        return workingDaysOfSelectedMonth() - getCountOfAttendances().countOfAcceptedAttendances 
        - workingDaysOfRemaningDays() - isHolidayInCurrentMonth();
    }

    const avgPresentDays = (): number => {
        return getCountOfAttendances().countOfAcceptedAttendances;

    }

    return (
        <>
            <div className={styles.status}>
                <div>
                    <h2>Total</h2>
                    <div className={styles.totalStatus}>
                        <div>
                            <h3>Leave Days</h3>
                            <h4>{avgLeaveDays()}</h4>
                        </div>
                        <div>
                            <h3>Present Days</h3>
                            <h4>{avgPresentDays()}</h4>
                        </div>
                        <div>
                            <h3>Absent Days</h3>
                            <h4>{'0'}</h4>
                        </div>
                    </div>
                </div>
                <div>
                    <h3>Average Worktime</h3>
                    <h4>Duration: {avgWorkTime()}</h4>
                </div>
            </div>

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
                        {DAYS.map((day, i) => {
                            return (
                                <div className={styles.headDay} key={i}>
                                    {day}
                                </div>
                            )
                        })}
                    </div>
                    <div className={styles.caldenderBody}>
                        {getSortedDays(currentMonth, currentYear).map((day, i) => {
                            return (
                                <div className={areDatesTheSame(new Date(), getDateObj(day, currentMonth, currentYear)) ? styles.styledActiveDay : styles.styledDay}
                                    key={i}>
                                    {day}
                                    {
                                        Holidays.HOLIDAYS_2023?.map((ev: any, i: any) => {
                                            return (
                                                areDatesTheSame(
                                                    getDateObj(day, currentMonth, currentYear),
                                                    new Date(ev.Date)
                                                )
                                                &&
                                                <div className={styles.holidayDates} key={i}>
                                                    {ev.Occasion}
                                                </div>
                                            )
                                        }
                                        )
                                    }
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