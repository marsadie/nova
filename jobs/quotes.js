import fetch from 'node-fetch';

const getQuote = async (stock) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stock}?range=21d&interval=1d&includePrePost=false&events=div%7Csplit%7Cearn&corsDomain=finance.yahoo.com`;
    const response = await fetch(url);
    const data = await await response.json();
    const open = data.chart.result ? data.chart.result[0].indicators.quote[0].open : null;
    const close = data.chart.result ? data.chart.result[0].indicators.quote[0].close : null;
    const high = data.chart.result ? data.chart.result[0].indicators.quote[0].high: null;
    const low = data.chart.result ? data.chart.result[0].indicators.quote[0].low : null;
    const volume = data.chart.result ? data.chart.result[0].indicators.quote[0].volume : null;
    return {
        open: open,
        high: high,
        low: low,
        close: close,
        volume: volume,
    };
}

export default getQuote;