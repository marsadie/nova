import nav, { navStyle } from './components/nav.js';
import stockcard, { cardStyle } from './components/card.js';
import { modalStyle } from './components/modal.js';
import { dailyChart, atrIvChart } from './components/chart.js';
import stocks from './api.js';

const _stocks = await stocks();

const app = document.querySelector('#app');
const body = document.querySelector('body');
const elements = [nav];
const elementWrapper = app;
const styles = [navStyle, cardStyle, modalStyle];
const styleSheet = document.createElement('style');

const createCard = async (stock) => {
    const createCard = stockcard(stock);
    createCard.then(async card => {
        elementWrapper.innerHTML += card;
        const chart = await dailyChart(stock);
        // const ivChart = atrIvChart(stock);
        body.append(document.createRange().createContextualFragment(chart));
        // body.append(document.createRange().createContextualFragment(ivChart));
    });
}

styles.forEach(style => {
    styleSheet.innerHTML += style;
});
document.head.append(styleSheet);
elements.forEach(element => {
    elementWrapper.innerHTML += element;
});

for (const stock of _stocks) {
    await createCard(stock);
}