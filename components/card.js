import { formatter } from '../utils/index.js'
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
        width: 36%;
    }
    .stock-card .right {
        display: inline-block;
        text-align: right;
        vertical-align: top;
        width: 62%;
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
    .stock-card .accordion-button {
        background-color: transparent;
    }
    .stock-card .accordion-button:focus {
        box-shadow: none;
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

const stockcard = async (stock) => {
    const { ticker, bidDollars, askDollars, yesterdaysClose, callIv, putIv, callRsi, putRsi, maxPain } = stock;
    const close = formatter.format(stock.close);
    const iv = (() => {
        if (callIv && putIv) {
            return bidDollars > askDollars ? putIv : callIv;
        } else {
            return callIv || putIv;
        }
    })();
    const prediction = Math.max(bidDollars, askDollars) - Math.min(bidDollars, askDollars) > 10000000;

    return new Promise(async (resolve) => {
        resolve(`
            <div class="card stock-card ${ticker.toLowerCase()}">
                <a href="#" class="open-modal" data-bs-toggle="modal" data-bs-target="#insightsModal-${ticker}">
                    <div class="card-body">
                        <div class="left">
                            <h4 class="card-title">${ticker}</h4>
                            <img src="https://apewisdom.io/img5/${ticker}.png" class="logo" />
                        </div>
                        <div class="right">
                            <h4 class="stockPrice" style="color: ${stock.close > yesterdaysClose ? `#32992d` : `#b23131`}">${close ?? 'err'}</h4>
                            <h5 class="card-subtitle mb-2 text-muted">
                                ${prediction ? bidDollars > askDollars ? `buy puts` : 'buy calls' : ''}
                            </h5>
                        </div>
                    </div>
                </a>
                <div class="accordion accordion-flush" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${ticker}" aria-expanded="false" aria-controls="collapse${ticker}">
                                Technicals
                            </button>
                        </h2>
                        <div id="collapse${ticker}" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <table class="table table-dark table-striped">
                                    <tbody>
                                        ${ iv ? `
                                        <tr>
                                            <th scope="row">option iv</th>
                                            <td>${iv}</td>
                                        </tr>
                                        ` : '' }
                                        <tr>
                                            <th scope="row">max pain</th>
                                            <td>${formatter.format(maxPain)}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">buying</th>
                                            <td>${formatter.format(bidDollars)}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">selling</th>
                                            <td>${formatter.format(askDollars)}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">call rsi</th>
                                            <td>${ callRsi[Object.keys(callRsi)[Object.keys(callRsi).length - 3]] +' '+ callRsi[Object.keys(callRsi)[Object.keys(callRsi).length - 2]] +' '+ callRsi[Object.keys(callRsi)[Object.keys(callRsi).length - 1]] }</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">put rsi</th>
                                            <td>${ putRsi[Object.keys(putRsi)[Object.keys(putRsi).length - 3]] +' '+ putRsi[Object.keys(putRsi)[Object.keys(putRsi).length - 2]] +' '+ putRsi[Object.keys(putRsi)[Object.keys(putRsi).length - 1]] }</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${await insightsmodal(stock)}
        `);
    });
}


// const stockcard = (stock) => {
//     const { ticker } = stock;

//     return new Promise(async (resolve) => {
//         resolve(`
//         <div class="card stock-card ${ticker.toLowerCase()}">
//             <div class="card-body">
//                 <a href="#" class="open-modal" data-bs-toggle="modal" data-bs-target="#insightsModal-${ticker}">
//                     <div class="left">
//                         <h4 class="card-title">${ticker}</h4>
//                         <img src="https://apewisdom.io/img5/${ticker}.png" class="logo" />
//                     </div>
//                     <div class="right">
//                         <h4 class="stockPrice">${stock.close ? stock.close[0] : 'err'}</h4>
//                         <h5 class="card-subtitle mb-2 text-muted">${stock.iv ?? 'err'}</h5>
//                     </div>
//                     <div class="card-img-bottom"><canvas id="${ticker}-chart" width=200 height=200></canvas></div>
//                     <p class="card-text"><svg class="bullish" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#54b154" class="bi bi-bar-chart" viewBox="0 0 24 24">
//                     <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
//                   </svg> <svg class="bearish" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b15454" class="bi bi-bar-chart" viewBox="0 0 24 24" style="transform: scaleX(-1);">
//                   <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
//                 </svg></p>
//                 </a>
//             </div>
//         </div>
//         ${await insightsmodal(ticker)}
//     `);
//     });
// }

export default stockcard;
