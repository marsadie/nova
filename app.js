import nav from './nav.js';
import stockcard, { cardStyle } from './card.js';
import { modalStyle } from './modal.js';
import stocks from './stocks.js';
import options from './options.js';
import chart from './chart.js';
import news from './news.js';
import * as insights from './insights.js';

const body = document.querySelector('body');
const app = document.querySelector('#app');

const style = document.createElement('style');
style.innerHTML += cardStyle
style.innerHTML += modalStyle;
document.head.append(style);

app.innerHTML += nav();

let storage = JSON.parse(localStorage.getItem('stocks')).length > 0;
if (storage) {
    let _stocks = JSON.parse(localStorage.getItem('stocks'));
    _stocks.forEach(async (stock) => {
        const object = JSON.parse(localStorage.getItem(stock));
        app.innerHTML += stockcard(object);
        const stockchart = await chart(stock);
        body.append(document.createRange().createContextualFragment(stockchart));
    });
} else {
    let _stocks = await stocks();
    localStorage.setItem('stocks', JSON.stringify(_stocks));
    _stocks.forEach(async (stock) => {
        const { getMaxPain, getInsights } = insights;
        const _options = await options(stock);
        const _insights = await getInsights(stock);
        const _getMaxPain = await getMaxPain(stock);
        const _news = await news(stock);
        const object = {
            name: stock,
            options: _options,
            news: _news,
            insights: _insights,
            maxPain: _getMaxPain,
        };
        localStorage.setItem(stock, JSON.stringify(object));
        app.innerHTML += stockcard(object);
        const stockchart = await chart(stock);
        body.append(document.createRange().createContextualFragment(stockchart));
    });
}

