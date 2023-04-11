import fetch from 'node-fetch';
import { MFI, RSI } from 'technicalindicators';

// biggest change candle (+/-)
// biggest volume increase
// biggest gap between atr and iv on same axis (0-100% for span of time)

export const priceChange = (thisp, lastp) => (Math.max(Math.abs(thisp.o), Math.abs(thisp.c)) - Math.min(Math.abs(thisp.o), Math.abs(thisp.c))) - (Math.max(Math.abs(lastp.o), Math.abs(lastp.c)) - Math.min(Math.abs(lastp.o), Math.abs(lastp.c)));

export const volumeChange = (thisp, lastp) => (thisp.v * 100) / lastp.v;

export const getTechnicals = async (ticker) => {
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?region=US&lang=en-US&includePrePost=false&interval=1d&useYfid=true&range=1y&corsDomain=finance.yahoo.com&.tsrc=finance`);
    const data = await response.json();
    const timestamps = data.chart.result[0].timestamp;
    const highPrices = data.chart.result[0].indicators.quote[0].high;
    const closePrices = data.chart.result[0].indicators.adjclose[0].adjclose;
    const lowPrices = data.chart.result[0].indicators.quote[0].low;
    const volume = data.chart.result[0].indicators.quote[0].volume;
    const mfi = MFI.calculate({ high: highPrices, low: lowPrices, close: closePrices, volume: volume, period: 7 }).map((mfi, i) => ({
        date: new Date(timestamps[i + 2] * 1000),
        value: mfi,
    }));
    const rsi = RSI.calculate({ values: closePrices, period: 7 }).map((rsi, i) => ({
        date: new Date(timestamps[i + 2] * 1000),
        value: rsi,
    }));
    return { mfi, rsi };
}

export const getIv = async (ticker) => {
    const length = (await getTechnicals(ticker)).atr.length;
    const response = await fetch(`https://www.alphaquery.com/data/option-statistic-chart?ticker=${ticker}&perType=30-Day&identifier=iv-mean`);
    const data = await response.json();
    return data.slice(-length).map((d) => d.value);
}

export const mfiRsiChart = async (ticker) => {
    const { mfi, rsi } = await getTechnicals(ticker);
    const maxMfiValue = Math.max(...mfi.map((item) => item.value));
    const minMfiValue = Math.min(...mfi.map((item) => item.value));
    const mfiScale = mfi.map((item) => ((item.value - minMfiValue) / (maxMfiValue - minMfiValue)));
    const maxRsiValue = Math.max(...rsi.map((item) => item.value));
    const minRsiValue = Math.min(...rsi.map((item) => item.value));
    const rsiScale = rsi.map((item) => ((item - minRsiValue) / (maxRsiValue - minRsiValue)));
    return {
        date: mfi.map((item) => item.date),
        mfi: mfiScale,
        rsi: rsiScale,
    }
}
