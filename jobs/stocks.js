import { load } from 'cheerio';
import fetch from 'node-fetch';
import csv from 'csvtojson';

export const getActiveOptionsStocks = async () => {
    const response = await fetch('https://www.optionseducation.org/toolsoptionquotes/today-s-most-active-options', {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
        }
    });
    const data = await response.text();
    const $ = load(data);
    const stocks = [];
    $('#equityData tbody td:first-child').each((i, element) => {
        stocks.push($(element).text());
    });
    return stocks;
}

export const getStocks = async () => {
    const activeOptionsStocks = await getActiveOptionsStocks();
    const response = await fetch('https://elite.finviz.com/export.ashx?v=150&f=sh_avgvol_4000to,sh_opt_option,sh_price_30to60,ta_averagetruerange_o1&p=h&o=-relativevolume&auth=marsadie@gmail.com');
    const data = await response.text();
    const json = await csv().fromString(data);
    const stocks = json.map(stock => (stock['Ticker'])).concat(activeOptionsStocks);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    const response2 = await fetch(`https://elite.finviz.com/export.ashx?v=111&f=sh_opt_option&ft=4&t=${stocks.join(',')}&auth=marsadie@gmail.com`);
    const data2 = await response2.text();
    const json2 = await csv().fromString(data2);
    return json2.map(stock => ({
        ticker: stock['Ticker'],
        company: stock['Company'],
        sector: stock['Sector'],
    }))
}