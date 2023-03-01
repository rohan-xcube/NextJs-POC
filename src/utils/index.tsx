import { DAYS } from "config/calenderOptions";

export const saveToStorage = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
        return window.localStorage.setItem(key, value);
    }
}

export const getFromStorage = (key: string) => {
    if (typeof window !== 'undefined') {
        let getData = window.localStorage.getItem(key) || ""
        return getData ? JSON.parse(getData) : "";
    }
}

export const removeFromStorage = (key: string) => {
    if (typeof window !== 'undefined') {
        return window.localStorage.removeItem(key);
    }
}

export const convertDateToTimeStamp = (givenDate: any) => {
    return (new Date(givenDate)).getTime();
}

export const convertTimeStampToDate = (givenTime: any) => {
    var date = new Date(givenTime);
    return date.toISOString()?.split('T')[0];
}

export const range = (end: any) => {
    const { result } = Array.from({ length: end }).reduce(
        ({ result, current }) => ({
            result: [...result, current],
            current: current + 1
        }),
        { result: [], current: 1 }
    );
    return result;
};

// export const sortDays = (date: any) => {
//     const dayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
//     const sortedDays = [...DAYS.slice(dayIndex), ...DAYS.slice(0, dayIndex)]
//     return sortedDays;
// }

export const getDaysInMonth = (month: any, year: any) => {
    return new Date(year, month + 1, 0).getDate()
}

export const getSortedDays = (month: any, year: any) => {
    const dayIndex = new Date(year, month, 1).getDay()
    return [...DAYS.slice(dayIndex), ...DAYS.slice(0, dayIndex)]
}

export const getDateObj = (day: any, month: any, year: any) => {
    return new Date(year, month, day)
}

export const areDatesTheSame = (first: any, second: any) => {
    return (
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
    )
}

export const dateRange = (startDate: any, endDate: any, steps = 1) => {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
        dateArray.push((currentDate).toUTCString());
        currentDate.setUTCDate(currentDate.getDate() + steps);
    }
    return dateArray
}

// export const getSortedDays = (date: any) => {
//     const daysInMonth = range(getDaysInMonth(date))
//     const index = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
//     return [...Array(index === 0 ? 6 : index - 1), ...daysInMonth]
// } 
