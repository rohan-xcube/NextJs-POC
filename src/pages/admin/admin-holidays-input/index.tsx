import Navbar from '@/pages/navbar'
import { LOCALHOST_URL } from 'config/localhostUrl';
import React, { useState } from 'react'
import styles from './index.module.css'


const AdminHolidaysInput = () => {

    const [selectedYear, setSelectedYear] = useState('');
    const [holidaysList, setHolidaysList] = useState<any>([{ occasion: '', eventDate: '' }]);

    const addFields = () => {
        setHolidaysList([...holidaysList, { occasion: '', eventDate: '' }]);
    }

    const submit = async (e: any) => {
        e.preventDefault();
        const response = await fetch(`${LOCALHOST_URL}/holidaysRequest/postHolidays`, {
            method: 'POST',
            body: JSON.stringify({ holidaysData: { selectedYear, holidaysList } }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        await response.json()
    }

    const handleChangeInput = (index: number, e: any) => {
        const values = [...holidaysList];
        values[index][e.target.name] = e.target.value;
        setHolidaysList(values)
    }
    
    const removeFields = (index: any) => {
        let data = [...holidaysList];
        data.splice(index, 1)
        setHolidaysList(data)
    }

    return (
        <>
            <Navbar />

            <form className={styles.holidaysInputForm} onSubmit={submit}>
                <div className={styles.yearInput}>
                    <label className={styles.inputTexts}>Year:<span className={styles.asterisk}>* </span></label>
                    <input type={'number'} placeholder='Enter year here' value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}></input>
                </div>
                <div>
                    {holidaysList.map((input: any, index: any) => {
                        return (
                            <div className={styles.detailsInput} key={index}>
                                <div>
                                    <label className={styles.inputTexts}>Occasion:<span className={styles.asterisk}>* </span></label>
                                    <input
                                        name='occasion'
                                        type={'text'}
                                        placeholder='Occasion'
                                        value={input.occasion}
                                        onChange={(e) => handleChangeInput(index, e)}
                                    />
                                </div>
                                <div>
                                    <label className={styles.inputTexts}>Date:<span className={styles.asterisk}>* </span></label>
                                    <input
                                        name='eventDate'
                                        type={'text'}
                                        placeholder='Date'
                                        value={input.eventDate}
                                        onChange={(e) => handleChangeInput(index, e)}
                                    />
                                </div>
                                <button onClick={() => removeFields(index)} className={styles.removeFieldBtn}>Remove Field</button>
                            </div>
                        )
                    })}
                </div>
                <button onClick={addFields} className={styles.addFieldBtn}>Add Field</button>
                <div>
                    <button className={styles.submitBtnEnabled}>Submit</button>
                </div>
            </form>
        </>
    )
}

export default AdminHolidaysInput;