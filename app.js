import nav from './components/nav.js';
import stockcard, { cardStyle } from './components/card.js';
import { dailyChart } from './components/chart.js';
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

for (const stock of _stocks) {
    const createCard = stockcard(stock);
    createCard.then(async card => {
        app.innerHTML += card;
        const chart = await dailyChart(stock);
        body.append(document.createRange().createContextualFragment(chart));
    })
}

// rewrite the above code to use Swift UI
// import SwiftUI
//
// struct ContentView: View {
//     var body: some View {
//         Text("Hello, world!")
//             .padding()
//     }
// }
//
// struct ContentView_Previews: PreviewProvider {
//     static var previews: some View {
//         ContentView()
//     }
// }