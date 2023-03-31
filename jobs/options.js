import { load } from 'cheerio';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const getOptionsYahoo = async (stock) => {
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
        putOption: putData && !putData.chart.error ? {
            timestamps: putData.chart.result[0].timestamp,
            quotes: putData.chart.result[0].indicators.quote[0],
         } : putData ? putData.chart.error.description : null,
        iv: (Number(callContract.iv.split('%')[0]) + Number(putContract.iv.split('%')[0])) / 2,

    }
}

const getOptionsRobinhood = async (stock) => {
    const response = await fetch(`https://api.robinhood.com/options/chains/?equity_symbol=${stock}`);
    const data = await response.json();
    const id = data.results[0].id;
    const expirationDate = data.results[0].expiration_dates[0];
    const chainResponse = await fetch(`https://api.robinhood.com/options/instruments/?chain_id=${id}&expiration_dates=${expirationDate}&state=active`);
    const chainData = await chainResponse.json();
    const optionIds = chainData.results.map(option => option.id);
    const optionsResponse = await fetch(`https://api.robinhood.com/marketdata/options/?ids=${optionIds.join('%2C')}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.ROBINHOOD_TOKEN}`,
        }
    });
    const optionsData = await optionsResponse.json();
    const highestOIOption = optionsData.results.sort((a, b) => b.open_interest - a.open_interest)[0];
    return {
        iv: highestOIOption.implied_volatility,
        occ: highestOIOption.occ_symbol,
        openInterest: highestOIOption.open_interest,
        delta: highestOIOption.delta,
        theta: highestOIOption.theta,
        price: highestOIOption.high_fill_rate_buy_price,
        bidSize: highestOIOption.bid_size,
        askSize: highestOIOption.ask_size,
        bidPrice: highestOIOption.bid_price,
        askPrice: highestOIOption.ask_price,
    }
}

export default getOptionsRobinhood;