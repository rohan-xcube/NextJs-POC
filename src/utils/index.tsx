
export const saveToStorage = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
        return window.localStorage.setItem(key, value);
    }
}

export const getFromStorage = (key: string) => {
    if (typeof window !== 'undefined') {
        let getData = window.localStorage.getItem(key) || ""
        return getData ?  JSON.parse(getData) : "";
    }
}

export const removeFromStorage = (key: string) => {
    if (typeof window !== 'undefined') {
        return window.localStorage.removeItem(key);
    }
}

