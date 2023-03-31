import cron from 'node-cron';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { getStocks } from '../jobs/stocks.js';
import books from '../jobs/books.js';
import options from '../jobs/options.js';
import quotes from '../jobs/quotes.js';
import { atrIvChart } from '../jobs/catalyst.js';

dotenv.config();

const uri = process.env.DB_URL;
const client = new MongoClient(uri);
const mongo = await client.connect();
const appDB = mongo.db('appDB');
const stocksCollection = appDB.collection('stocks');

const log = console.log;

log(chalk.blue('Getting stocks...'));
const _stocks = await getStocks();

const createDoc = async (stock) => {
    log(chalk.blue(`Creating document for ${stock.ticker}...`));
    log(chalk.blue(`...Getting books for ${stock.ticker}...`));
    const bookData = await books(stock.ticker);
    log(chalk.blue(`...Getting options for ${stock.ticker}...`));
    const optionsData = await options(stock.ticker);
    log(chalk.blue(`...Getting quotes for ${stock.ticker}...`));
    const quoteData = await quotes(stock.ticker);

    const { company, sector } = stock;
    const { bidVolume, askVolume, bestBid, bestAsk, bidDollars, askDollars } = bookData;
    const { iv, occ, openInterest, delta, theta, bidPrice, askPrice } = optionsData;
    const { close, volume, rsi } = quoteData;

    const doc = {
        ticker: stock.ticker,
        company: company,
        sector: sector,
        chart: close,
        atrIvChart: await atrIvChart(stock.ticker),
        close: close.pop(),
        yesterdaysClose: close[close.length - 2],
        volume: volume,
        relVolume: volume.pop() / volume[volume.length - 2],
        rsi: rsi.pop(),
        bidVolume: bidVolume,
        askVolume: askVolume,
        bidDollars: bidDollars,
        askDollars: askDollars,
        bestBid: bestBid,
        bestAsk: bestAsk,
        occ: occ,
        openInterest: openInterest,
        delta: delta,
        theta: theta,
        bidPrice: bidPrice,
        askPrice: askPrice,
        iv: iv,
        lastUpdated: new Date()
    }
    return doc;
}

const firstCronRun = async () => {
    stocksCollection.deleteMany({});
    stocksCollection.findOneAndDelete({ ticker: { $nin: _stocks.map(stock => (stock.ticker)) } });
    for (const stock of _stocks) {
        const { ticker } = stock;
        const doc = await createDoc(stock);
        stocksCollection.replaceOne({ ticker: ticker }, doc, { upsert: true });
        log(chalk.green.italic('added/updated', ticker))
    }
    return true;
}

await firstCronRun();

cron.schedule('5 9-15 * * 1-5', async () => {
    log(chalk.yellow.bold('refreshing...'));
    await firstCronRun();
});
