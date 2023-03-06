import { formatter } from './utils/index.js';
import { insightsmodal } from './modal.js';

export const cardStyle = `
    .card {
        background-color: #212529;
        border-radius: 30px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        color: #eee;
        display: block;
        margin: 10px auto;
        padding: 16px;
        position: relative;
        width: 96vw;
    }
    .stock-card .left {
        display: inline-block;
        vertical-align: top;
        width: 46%;
    }
    .stock-card .right {
        display: inline-block;
        text-align: right;
        vertical-align: top;
        width: 52%;
    }
    .stock-card h4 {
        font-size: 1.5rem;
        margin: 0;
    }
    .stock-card h5 {
        font-size: 1rem;
        margin: 0;
    }
    .stock-card h5 svg {
        position: relative;
        top: -2px;
    }
    .stock-card .stockPrice {
        margin-bottom: 5px;
    }
    .stock-card a.open-modal {
        color: #eee;
        text-decoration: none;
    }
    .stock-card img.logo {
        filter: grayscale(100%);
        width: 50px;
        position: relative;
        top: 10px;
        left: 5px;
    }
    .stock-card .max-pain {
        animation: blink-animation 1s steps(2, start) infinite;
        -webkit-animation: blink-animation 1s steps(2, start) infinite;
    }
    @keyframes blink-animation {
        to {
            opacity: 0.8;
        }
    }
    @-webkit-keyframes blink-animation {
        to {
            opacity: 0.8;
        }
    }
    .stock-card .card-img-bottom {
        margin-top: 15px;
    }
`;

const stockcard = (stock) => {
    const { name, options, insights, maxPain } = stock;
    const { expiration, callItmPrice, putItmPrice } = options;
    const { technicalPatternDirection: direction } = insights;

    return `
        <div class="card stock-card ${name.toLowerCase()}">
            <div class="card-body">
                <a href="#" class="open-modal" data-bs-toggle="modal" data-bs-target="#insightsModal-${name}">
                    <div class="left">
                        <h4 class="card-title">${name}</h4>
                        <img src="https://apewisdom.io/img5/${name}.png" class="logo" />
                    </div>
                    <div class="right">
                        <h4 class="stockPrice"></h4>
                        <h5>${formatter.format(callItmPrice + putItmPrice)} &plusmn;</h5>
                        <h5 class="max-pain">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-fire" viewBox="0 0 14 14">
                            <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z"/>
                            </svg> 
                            ${formatter.format(maxPain)}
                        </h5>
                        <h5>${expiration}</h5>
                    </div>
                    <div class="card-img-bottom"><canvas id="${name}-chart" width=200 height=200></canvas></div>
                    <p class="card-text">${direction == 'L' ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bar-chart" viewBox="0 0 24 24">
                    <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                  </svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bar-chart" viewBox="0 0 24 24" style="transform: scaleX(-1);">
                  <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                </svg>`}</p>
                </a>
            </div>
        </div>
        ${insightsmodal(stock)}
    `;
}

export default stockcard;
