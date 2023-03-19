import fetch from 'node-fetch';

const getBooks = async (stock) => {
    const cboeBzxUrl = `https://www.cboe.com/json/bzx/book/${stock}`;
    const cboeByxUrl = `https://www.cboe.com/json/byx/book/${stock}`;
    const cboeEdgxUrl = `https://www.cboe.com/json/edgx/book/${stock}`;
    const cboeEdgaUrl = `https://www.cboe.com/json/edga/book/${stock}`;
    const urls = [cboeBzxUrl, cboeByxUrl, cboeEdgxUrl, cboeEdgaUrl];
    const books = await Promise.all(urls.map(async (url) => {
        const response = await fetch(url, {
            referrer: 'https://www.cboe.com/',
            referrerPolicy: 'strict-origin-when-cross-origin',
        });
        const data = await response.json();
        return data;
    }));
    const bidDollars = books.map((book) => book.data.bids.map((bid) => bid[0] * bid[1] * 100)).flat().reduce((a, b) => a + b, 0);
    const askDollars = books.map((book) => book.data.asks.map((ask) => ask[0] * ask[1] * 100)).flat().reduce((a, b) => a + b, 0);
    const bidVolume = books.map((book) => book.data.bids.map((bid) => bid[0] * 100)).flat().reduce((a, b) => a + b, 0);
    const askVolume = books.map((book) => book.data.asks.map((ask) => ask[0] * 100)).flat().reduce((a, b) => a + b, 0);
    const bestBid = books.data ? books.map((book) => book.data.bids[0][1]).reduce((a, b) => Math.max(a, b), 0) : null;
    const bestAsk = books.data ? books.map((book) => book.data.asks[0][1]).reduce((a, b) => Math.min(a, b), Infinity): null;
    return {
        bidVolume: bidVolume,
        askVolume: askVolume,
        bidDollars: bidDollars,
        askDollars: askDollars,
        bestBid: bestBid,
        bestAsk: bestAsk,
    };
}

export default getBooks;
