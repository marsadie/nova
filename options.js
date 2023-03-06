import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.4/+esm';
import cheerio from 'https://cdn.jsdelivr.net/npm/cheerio@1.0.0-rc.12/+esm';

const getOptions = async (stock) => {
    const today = new Date();
    const day = today.getDay();
    const friday = new Date(today);
    friday.setDate(today.getDate() + (5 + 7 - day) % 7);
    const month = friday.getMonth() + 1;
    const dayOfMonth = friday.getDate();
    const year = friday.getFullYear();
    const date = new Date(year+'-'+month+'-'+dayOfMonth);
    const expiration = `${new Date(date).toLocaleString('default', { month: 'numeric', day: 'numeric' })}`;
    const response = await axios.get(`https://finance.yahoo.com/quote/${stock}/options?p=${stock}`);
    const $ = cheerio.load(response.data);
    const callPrices = [];
    const putPrices = [];
    $('.calls tr.in-the-money').each((i, element) => {
        callPrices.push({
            strike: $(element).find('.data-col2').text(),
            price: $(element).find('.data-col4').text(),
            iv: $(element).find('.data-col6').text(),
            volume: $(element).find('.data-col7').text(),
            oi: $(element).find('.data-col8').text()
        });
    });
    $('.puts tr.in-the-money').each((i, element) => {
        putPrices.push({
            strike: $(element).find('.data-col2').text(),
            price: $(element).find('.data-col4').text(),
            iv: $(element).find('.data-col6').text(),
            volume: $(element).find('.data-col7').text(),
            oi: $(element).find('.data-col8').text()
        });
    });
    const callItmPrice = $('.calls tr.in-the-money .data-col4').last().text();
    const putItmPrice = $('.puts tr.in-the-money .data-col4').first().text();
    return {
        expiration: expiration,
        callPrices: callPrices,
        putPrices: putPrices,
        callItmPrice: Number(callItmPrice),
        putItmPrice: Number(putItmPrice)
    }
}

export default getOptions;