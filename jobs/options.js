import { load } from 'cheerio';
import fetch from 'node-fetch';
import { RSI } from 'technicalindicators';

const getOptions = async (stock) => {
    const contracts = async (type) => {
        const response = await fetch(`https://finance.yahoo.com/quote/${stock}/options?p=${stock}`);
        const $ = load(await response.text());
        const callStr = $('.calls tr.in-the-money .data-col0').last().text();
        const putStr =  $('.puts tr.in-the-money .data-col0').first().text();
        const callIv = $('.calls tr.in-the-money .data-col10').last().text();
        const putIv = $('.puts tr.in-the-money .data-col10').first().text();
        return {
            contractStr: type === 'call' ? callStr : putStr,
            iv: type === 'call' ? callIv : putIv,
        }
    }
    const callContract = await contracts('call');
    const putContract = await contracts('put');
    const lastYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const today = new Date();
    const lastYearTimestamp = Math.floor(lastYear.getTime() / 1000);
    const todayTimestamp = Math.floor(today.getTime() / 1000);
    const callUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${callContract.contractStr}?period1=${lastYearTimestamp}&period2=${todayTimestamp}&interval=1d&includePrePost=true&events=div%7Csplit%7Cearn&useYfid=true&lang=en-US&region=US`;
    const putUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${putContract.contractStr}?period1=${lastYearTimestamp}&period2=${todayTimestamp}&interval=1d&includePrePost=true&events=div%7Csplit%7Cearn&useYfid=true&lang=en-US&region=US`;
    const callResponse = await fetch(callUrl);
    const putResponse = await fetch(putUrl);
    const callData = callResponse.status == 200 ? await callResponse.json() : undefined;
    const putData = putResponse.status == 200 ? await putResponse.json() : undefined;
    return {
        callOption: callData && !callData.chart.error ? {
            timestamps: callData.chart.result[0].timestamp,
            quotes: callData.chart.result[0].indicators.quote[0],
         } : callData ? callData.chart.error.description : null,
        callIv: callContract.iv,
        callRsi: callData && !callData.chart.error ? RSI.calculate({
            values: callData.chart.result[0].indicators.quote[0].close,
            period: 2,
        }) : null,
        putOption: putData && !putData.chart.error ? {
            timestamps: putData.chart.result[0].timestamp,
            quotes: putData.chart.result[0].indicators.quote[0],
         } : putData ? putData.chart.error.description : null,
        putIv: putContract.iv,
        putRsi: putData && !putData.chart.error ? RSI.calculate({
            values: putData.chart.result[0].indicators.quote[0].close,
            period: 2,
        }) : null,
    }
}

export default getOptions;