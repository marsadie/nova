import cron from 'node-cron';
import chalk from 'chalk';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { getStocks } from '../jobs/stocks.js';
import books from '../jobs/books.js';
import options from '../jobs/options.js';
import quotes from '../jobs/quotes.js';
import news from '../jobs/news.js';
import { getMaxPain } from '../jobs/insights.js';

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
    log(chalk.blue(`...Getting news for ${stock.ticker}...`));
    const newsData = await news(stock.ticker);
    log(chalk.blue(`...Getting max pain for ${stock.ticker}...`));
    const maxPain = await getMaxPain(stock.ticker);

    const { company, sector } = stock;
    const { bidVolume, askVolume, bestBid, bestAsk, bidDollars, askDollars } = bookData;
    const { callOption, putOption, callIv, putIv, callRsi, putRsi } = optionsData;
    const { close, volume } = quoteData;

    const doc = {
        ticker: stock.ticker,
        company: company,
        sector: sector,
        close: close.pop(),
        yesterdaysClose: close[close.length - 2],
        volume: volume.pop() / volume[volume.length - 2],
        bidVolume: bidVolume,
        askVolume: askVolume,
        bidDollars: bidDollars,
        askDollars: askDollars,
        bestBid: bestBid,
        bestAsk: bestAsk,
        callOption: callOption,
        putOption: putOption,
        callIv: callIv,
        putIv: putIv,
        callRsi: callRsi,
        putRsi: putRsi,
        maxPain: maxPain,
        news: newsData,
    }
    return doc;
}

const updateDocs = async () => {
    //stocksCollection.deleteMany({});
    stocksCollection.findOneAndDelete({ ticker: { $nin: _stocks.map(stock => stock.ticker) } });
    for (const stock of _stocks) {
        const { ticker } = stock;
        const doc = await createDoc(stock);
        stocksCollection.updateOne({ ticker: ticker }, { $set: doc }, { upsert: true });
        log(chalk.green.italic('added/updated', ticker))
    }
    return true;
}

await updateDocs();

cron.schedule('0/3 9-16 * * 1-5', async () => {
    log(chalk.yellow.bold('refreshing stocks every 3 minutes'));
    await updateDocs();
});
