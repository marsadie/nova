import nav, { navStyle } from './components/nav.js';
import stockcard, { cardStyle } from './components/card.js';
import { modalStyle } from './components/modal.js';
import { dailyChart, mfiRsiChart } from './components/chart.js';
import stocks from './api.js';

const _stocks = await stocks();

// green = #3b5337
// red = #5c2d2d

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
        const rsiChart = mfiRsiChart(stock);
        body.append(document.createRange().createContextualFragment(chart));
        body.append(document.createRange().createContextualFragment(rsiChart));
    });
}

styles.forEach(style => {
    styleSheet.innerHTML += style;
});
document.head.append(styleSheet);
_stocks['advancersDecliners']['advancers'] > _stocks['advancersDecliners']['decliners'] ? body.style.backgroundColor = '#5c2d2d' : body.style.backgroundColor = '#3b5337';
elements.forEach(element => {
    elementWrapper.innerHTML += element;
});

for (const stock of _stocks) {
    !Object(stock).hasOwnProperty('ticker') ? false : await createCard(stock);
}