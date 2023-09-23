import React, {useEffect, useState} from "react";
import axios from 'axios'
import {ExchangeRates} from '@/src/Currency'
import styles from '@/styles/index.module.css'


export default function Home() {
    const [fromCurrency,setFromCurrency] = useState(" ")
    const [toCurrency,setToCurrency] = useState(" ")
    const [amount,setAmount] = useState(0)
    const [convertedAmount,setConvertedAmount] = useState(0)

    const currencies = GetCurrencies();
    const handleConvertButton=()=>{
        if(currencies === null){return} //do nothing
        setConvertedAmount(Convert(currencies.rates[fromCurrency],currencies.rates[toCurrency],amount))
    }
    const handleAmountChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        setAmount(Number(e.target.value))
    }

    return (
        <main className={styles.main}>
            <div className={styles.title}>
                <h1>Exchange Rate Calculator</h1>
            </div>
            <div className={styles.calculator}>
                <div className={styles.exchange}>
                    <div className={styles.amount}>
                        <p>Amount</p>
                        <input type='number' defaultValue={amount} onChange={handleAmountChange}/>
                    </div>
                    <div className={styles.currency}>
                        <p>From</p>
                        <DropDown func={setFromCurrency} currencies={currencies?.rates}/>
                    </div>
                    <p>&rarr;</p>
                    <div className={styles.currency}>
                        <p>To</p>
                        <DropDown func={setToCurrency} currencies={currencies?.rates}/>
                    </div>
                </div>
                <div className={styles.convert}>
                    {
                        (fromCurrency=== " " || toCurrency === " " || amount === 0) ?
                            <>
                                <button className={styles.convertButton2}>Convert</button>
                            </>:
                            <>
                                <button onClick={handleConvertButton} className={styles.convertButton1}>Convert</button>
                                <p>Converted: {convertedAmount}</p>
                            </>
                    }
                </div>
            </div>

        </main>
    )
}

type DropDownProps = {
 func:(arg0: string)=>void;
 currencies: {[p: string]: number} | undefined;
}
export function DropDown({func,currencies}:DropDownProps){
    const [selectedOption,setSelectedOption] = useState(''); //set initial value to empty string
    let index = 0;
    // @ts-ignore
    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    }
    useEffect(() => {
        func(selectedOption);
    }, [selectedOption]);

    if(currencies === null || currencies === undefined)
        return <p>Loading....</p>
    return (
        <div>
            <select value={selectedOption} onChange={handleChange}>
                {Object.keys(currencies).map((currency) => (
                    <option key={index++} value={currency}>
                        {currency}
                    </option>
                ))
                }
            </select>
        </div>
    )
}
//Free plan conversion from EUR to selected currencies
export function GetCurrencies(): ExchangeRates | null {
    const [data, setData] = useState<ExchangeRates | null>(null);
    const url = 'http://api.exchangeratesapi.io/v1/latest';

    useEffect(() => {
        axios.get(url + '?access_key=538354f4e5a9ffdbaa2e0b12438e8bd0')
            .then(response => setData(response.data))
            .catch(error => console.log(error));
    }, []);
    return data;
}

export function Convert(fromCurrency:number,toCurrency:number,amount:number){
    console.log(fromCurrency)
    console.log(toCurrency)
    console.log(amount)
    let totalEuro = amount / fromCurrency;
    return totalEuro * toCurrency;
}