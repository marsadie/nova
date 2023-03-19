import nav from './components/nav.js';
import stockcard, { cardStyle } from './components/card.js';
import { optionChart } from './components/chart.js';
import { modalStyle } from './components/modal.js';
import stocks from './api.js';

const body = document.querySelector('body');
const app = document.querySelector('#app');

const style = document.createElement('style');
style.innerHTML += cardStyle
style.innerHTML += modalStyle;
document.head.append(style);

app.innerHTML += nav();

let _stocks = await stocks();
//let _stocks = JSON.parse(localStorage.getItem('stocks')) || [];

for (const stock of _stocks) {
    const createCard = stockcard(stock);
    createCard.then(async card => {
        app.innerHTML += card;
        //const callChart = optionChart(stock);
        //body.append(document.createRange().createContextualFragment(callChart));
    })
}
// for (const stock of _stocks.documents) {
//     const stockchart = await chart(stock);
//     body.append(document.createRange().createContextualFragment(stockchart));
// }
