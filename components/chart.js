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
            ${tag}
        </script>
    `;
};

export const atrIvChart = (stock) => {
    const { atrIvChart, ticker } = stock;
    let { atr, iv } = atrIvChart;
    atr = atr.slice(-7);
    iv = iv.slice(-7);
    return `
        <script defer>
            google.charts.load('current', {
                'packages': ['corechart']
            });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Time', 'ATR', 'IV'],
                    ${atr.map((atr, i) => (`[${i}, ${atr}, ${iv[i]}]`)).join(',')}
                ]);

                var options = {
                    curveType: 'none',
                    backgroundColor: 'transparent',
                    textStyle: { color: '#eee' },
                    hAxis: {
                        baselineColor: 'transparent',
                        gridlines: { count: 0 },
                        ticks: [],
                        textStyle: { color: '#eee' }
                    },
                    vAxis: {
                        baselineColor: 'transparent',
                        gridlines: { count: 0 },
                        ticks: [],
                        textStyle: { color: '#eee' }
                    },
                    legend: { position: 'bottom', color: '#eee', textStyle: { color: '#eee' } },
                };

                var chart = new google.visualization.LineChart(document.getElementById('${ticker}-iv-chart'));

                chart.draw(data, options);
            }
        </script>
`;
}