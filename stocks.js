import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.4/+esm';
import cheerio from 'https://cdn.jsdelivr.net/npm/cheerio@1.0.0-rc.12/+esm';

const getStocks = async () => {
    const response = await axios.get('https://www.optionseducation.org/toolsoptionquotes/today-s-most-active-options', {
        headers: {
            'Content-Type': 'text/html',
        }
    });
    const $ = cheerio.load(response.data);
    const stocks = [];
    $('#equityData tbody td:first-child').each((i, element) => {
        stocks.push($(element).text());
    });
    return stocks;
}

export default getStocks;