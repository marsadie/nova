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
    const response = await fetch('https://elite.finviz.com/export.ashx?v=151&f=ind_stocksonly,sh_avgvol_10000to,sh_opt_option,sh_price_30to200,ta_averagetruerange_o1&ft=3&p=h&auth=marsadie@gmail.com', {
        method: 'GET',
        headers: {
            'Cookie': 'SameSite=None; Secure',
        }
    });
    const data = await response.text();
    const json = await csv().fromString(data);
    const stocks = activeOptionsStocks.concat(['QQQ', 'SPY']); //json.map(stock => (stock['Ticker'])).concat(activeOptionsStocks);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    const response2 = await fetch(`https://elite.finviz.com/export.ashx?v=111&ft=4&t=${stocks.join(',')}&auth=marsadie@gmail.com`, {
        method: 'GET',
        headers: {
            'Cookie': 'SameSite=None; Secure',
        }
    });
    const data2 = await response2.text();
    const json2 = await csv().fromString(data2);
    return json2.map(stock => ({
        ticker: stock['Ticker'],
        company: stock['Company'],
        sector: stock['Sector'],
    }))
}