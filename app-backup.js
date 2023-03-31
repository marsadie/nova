import nav, { navStyle } from './components/nav.js';
import stockcard, { cardStyle } from './components/card.js';
import { dailyChart, atrIvChart } from './components/chart.js';
import { modalStyle } from './components/modal.js';
import stocks from './api.js';
import { prediction } from './utils/index.js';
import books from './jobs/books.js';
import options from './jobs/options.js';
import quotes from './jobs/quotes.js';

import { getStocks } from './jobs/stocks.js';

// const page = document.documentElement;
// const body = document.querySelector('body');
// const app = document.querySelector('#app');

// const style = document.createElement('style');
// style.innerHTML += navStyle;
// style.innerHTML += cardStyle
// style.innerHTML += modalStyle;
// document.head.append(style);

// app.innerHTML += nav();

//local
const _stocks = await getStocks();
const createDoc = async (stock) => {
    const bookData = await books(stock.ticker);
    const optionsData = await options(stock.ticker);
    const quoteData = await quotes(stock.ticker);

    const { company, sector } = stock;
    const { bidVolume, askVolume, bestBid, bestAsk, bidDollars, askDollars } = bookData;
    const { callOption, putOption, iv } = optionsData;
    const { close, volume, rsi } = quoteData;

    const doc = {
        ticker: stock.ticker,
        company: company,
        sector: sector,
        chart: close,
        //atrIvChart: await atrIvChart(stock.ticker),
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
        callOption: callOption,
        putOption: putOption,
        iv: iv,
        lastUpdated: new Date()
    }
    return doc;
}

// const createCard = async (stock) => {
//     const createCard = stockcard(stock);
//     createCard.then(async card => {
//         app.innerHTML += card;
//         const chart = await dailyChart(stock);
//         const ivChart = atrIvChart(stock);
//         body.append(document.createRange().createContextualFragment(chart));
//         body.append(document.createRange().createContextualFragment(ivChart));
//     });
// }



// mongodb
//let _stocks = await stocks();

for (const stock of _stocks) {
    //local
    const doc = await createDoc(stock);
    const { bidDollars, askDollars, iv } = doc
    console.log(stock.ticker, prediction(bidDollars, askDollars, iv));
    //await createCard(doc);
    //----------------
    //mongodb
    //await createCard(stock);
    //----------------
}

// rewrite the above code in react native

// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
//
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });