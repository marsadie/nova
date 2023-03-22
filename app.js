import nav, { navStyle } from './components/nav.js';
import stockcard, { cardStyle } from './components/card.js';
import { dailyChart } from './components/chart.js';
import { modalStyle } from './components/modal.js';
import stocks from './api.js';

const body = document.querySelector('body');
const app = document.querySelector('#app');

const style = document.createElement('style');
style.innerHTML += navStyle;
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