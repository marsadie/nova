import { formatter } from '../utils/index.js';

export const dailyChart = async (stock) => {
    const { ticker } = stock;
    const close = stock.close ? stock.close : [0,1];
    const volume = stock.volume ? stock.volume : [0,1];
    const todaysPrice = close[close.length - 1];
    const yesterdaysPrice = close[close.length - 1];
    const todaysVolume = volume[volume.length - 1];
    const yesterdaysVolume = volume[volume.length - 2];

    const tag = () => {
        return `
        const ${ticker}Chart = new Chart(document.getElementById('${ticker}-chart').getContext('2d'), {
            type: 'line',
            data: {
                labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(255, 255, 255)',
                    data: [${close}],
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
        <script defer>
            // document.getElementById('${ticker}-chart').addEventListener('load', () => {
                document.querySelector('.${ticker.toLowerCase()} .stockPrice').innerHTML = '${formatter.format(todaysPrice)}'; 
                ${tag()};
                document.querySelector('.${ticker.toLowerCase()} .stockPrice').style = 'color: ${todaysPrice > yesterdaysPrice ? '#54b154' : '#b15454'}';
                if (${todaysVolume} > ${yesterdaysVolume} && ${todaysPrice} > ${yesterdaysPrice}) {
                    document.querySelector('.bearish').style = 'display: inline;';
                } else 
                if (${todaysVolume} > ${yesterdaysVolume} && ${todaysPrice} < ${yesterdaysPrice}) {
                    document.querySelector('.bullish').style = 'display: inline;';
                } else {
                    console.log('No signal');
                }
            // });
        </script>
    `;
};

export const optionChart = (stock) => {
    const { ticker, callOption, putOption } = stock;
    return `
        <script defer>
            google.charts.load('current', {
                'packages': ['corechart']
            });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Day', 'Call', 'Put'],
                    ${callOption && putOption ? callOption.timestamps.map((timestamp, i) => {
                        const putClose = putOption.quotes.close.find((c, i) => i === putOption.timestamps.indexOf(timestamp));
                        return `[${new Date(timestamp * 1000).getDate().toString()}, ${callOption.quotes.close[i]}, ${putClose}]`;
                    }) : []},
                ]);

                var options = {
                    curveType: 'function',
                    legend: { position: 'bottom' }
                };

                var chart = new google.visualization.LineChart(document.getElementById('${ticker}-chart'));

                chart.draw(data, options);
            }
        </script>
`;
}