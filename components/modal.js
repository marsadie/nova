export const modalStyle = `
    .modal-header, .modal-footer {
        border-color: rgba(144, 145, 147, 0.5);
    }
    .modal .btn-close {
        filter: invert(100%);
    }
    .modal-backdrop {
        opacity: 0.1 !important;
    }
    .modal * {
        color: #ccc;
    }
    .modal-content {
        background-color: rgba(33, 37, 41, 0.99);
        border-radius: 30px;
        padding-bottom: 15px;
    }
    .modal-body .finviz-chart {
        filter: grayscale(100%) invert(100%) contrast(120%) brightness(100%);
        width: 100%;
    }
    .modal-body li a {
        color: #eee;
        font-weight: bold;
        text-decoration: none;
    }
    .modal-body li p:last-child {
        color: #eee;
}`;

export const insightsModal = async (stock) => {
    const { ticker, company, iv, rsi } = stock;
    return `
        <div class="modal fade" id="insightsModal-${ticker}" tabindex="-1" aria-labelledby="insightsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">${company}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>
                            <img src="https://charts-node.finviz.com/chart.ashx?cs=l&t=${ticker}&tf=h&s=linear&ct=candle_stick&o[0][ot]=patterns&o[0][op]=&o[0][oc]=69C1EAFF" class="finviz-chart" />
                        </p>
                        <table class="table table-dark table-striped">
                                    <tbody>
                                        ${iv ? `
                                        <tr>
                                            <th scope="row">implied volatility</th>
                                            <td>${(Number(iv) * 100).toFixed(0)}%</td>
                                        </tr>
                                        ` : ''}
                                        <tr>
                                            <th scope="row">rsi 10</th>
                                            <td>${rsi.toFixed(0)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                        <!-- <div id="${ticker}-iv-chart" width="400" height="200"></div> -->
                    </div>
                    <!-- <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div> -->
                </div>
            </div>
        </div>
    `;
};