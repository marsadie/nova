import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.4/+esm';
import { formatter } from './utils/index.js';

const prices = async (stock) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stock}?range=21d&interval=1d&includePrePost=false&events=div%7Csplit%7Cearn&corsDomain=finance.yahoo.com`;
    const response = await axios.get(url);
    const close = response.data.chart.result[0].indicators.quote[0].close;
    return close;
}

const chart = async (stock) => {
    const closePrices = await prices(stock);

    const tag = (stock) => {
        const data = closePrices;
        return `
        const ${stock}Chart = new Chart(document.getElementById('${stock}-chart').getContext('2d'), {
            type: 'line',
            data: {
                labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(255, 255, 255)',
                    data: [${data}],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    point: {
                        pointStyle: false,
                    },
                    line: {
                        borderWidth: 2,
                        tension: 0,
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        display: false,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: false,
                        grid: {
                            display: false
                        }
                    },
                }
            }
        });
    `;
    }

    return `
        <script> 
            document.querySelector('.${stock.toLowerCase()} .stockPrice').innerHTML = '${formatter.format(closePrices[closePrices.length - 1])}'; 
            ${tag(stock)};
        </script>
    `;

};

export default chart;