import cron from 'node-cron';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { getStocks } from '../jobs/stocks.js';
import books from '../jobs/books.js';
import options from '../jobs/options.js';
import quotes from '../jobs/quotes.js';
import advDec from '../jobs/advDec.js';
import { prediction } from './index.js'
import { mfiRsiChart } from '../jobs/catalyst.js';

dotenv.config();

const uri = process.env.DB_URL;
const client = new MongoClient(uri);
const mongo = await client.connect();
const appDB = mongo.db('appDB');
const stocksCollection = appDB.collection('stocks');

const log = console.log;

log(chalk.blue('Getting stocks...'));
const _stocks = await getStocks();

const advDecData = await advDec();
const createDoc = async (stock) => {
    log(chalk.blue(`Creating document for ${stock.ticker}...`));
    log(chalk.blue(`...Getting books for ${stock.ticker}...`));
    const bookData = await books(stock.ticker);
    log(chalk.blue(`...Getting options for ${stock.ticker}...`));
    const optionsData = await options(stock.ticker);
    log(chalk.blue(`...Getting quotes for ${stock.ticker}...`));
    const quoteData = await quotes(stock.ticker);

    const { company, sector } = stock;
    const { bidVolume, askVolume, bidDollars, askDollars } = bookData;
    const { iv, occ, openInterest, averageOI, delta, theta, bidPrice, askPrice, optionCallsOpenInterest, optionPutsOpenInterest } = optionsData;
    const { close, volume, rsi } = quoteData;

    const doc = {
        ticker: stock.ticker,
        company: company,
        sector: sector,
        chart: close,
        mfiRsi: await mfiRsiChart(stock.ticker),
        close: close.pop(),
        yesterdaysClose: close[close.length - 2],
        volume: volume,
        relVolume: volume.pop() / volume[volume.length - 2],
        rsi: rsi.pop(),
        bidVolume: bidVolume,
        askVolume: askVolume,
        bidDollars: bidDollars,
        askDollars: askDollars,
        occ: occ,
        openInterest: openInterest,
        averageOI: averageOI,
        delta: delta,
        theta: theta,
        bidPrice: bidPrice,
        askPrice: askPrice,
        optionCallsOpenInterest: optionCallsOpenInterest,
        optionPutsOpenInterest: optionPutsOpenInterest,
        iv: iv,
        lastUpdated: new Date()
    }
    return doc;
}

const firstCronRun = async () => {
    await stocksCollection.deleteMany({});
    //stocksCollection.findOneAndDelete({ ticker: { $nin: _stocks.map(stock => (stock.ticker)) } });
    await stocksCollection.replaceOne({ advancersDecliners: { $exists: true || false } }, { advancersDecliners: advDecData }, { upsert: true });
    for (const stock of _stocks) {
        const { ticker } = stock;
        const doc = await createDoc(stock);
        await stocksCollection.replaceOne({ ticker: ticker }, doc, { upsert: true });
        log(chalk.green.italic('added/updated', ticker))
    }
    return true;
}

await firstCronRun();

cron.schedule('5 9-15 * * 1-5', async () => {
    log(chalk.yellow.bold('refreshing...'));
    await firstCronRun();
});
