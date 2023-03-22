import { formatter } from '../utils/index.js';

export const dailyChart = async (stock) => {
    const { ticker, chart } = stock;

    const tag = `
        const ${ticker}Chart = new Chart(document.getElementById('${ticker}-chart').getContext('2d'), {
            type: 'line',
            data: {
                labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(255, 255, 255)',
                    data: [${chart}],
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

    return `
        <script>
            <!-- document.querySelector('.stock-card.${ticker}').addEventListener('load', () => { -->
                ${tag}
            <!-- }); -->
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