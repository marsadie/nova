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
    .modal-body ul.news {
        list-style-type: none;
        padding: 0;
    }
    .modal-body li a {
        color: #eee;
        font-weight: bold;
        text-decoration: none;
    }
    .modal-body li p:last-child {
        color: #eee;
}`;

export const insightsmodal = (stock) => {
    const { name, insights, news } = stock;
    const { items, sentiment } = news;
    const { bearishSummary, bullishSummary } = insights;
    const newsList = items.slice(0, 3).map((item) => {
        return `
            <li>
                <p>
                    <a href="${item.url}" target="_blank">${item.title}</a><br />
                    ${new Date(item.date).toLocaleString()}<br />
                    <em>${item.source}</em>
                </p>
            </li>
        `;
    }).join('');
    const bullishSummaryList = bullishSummary.map((summary) => {
        return `
            <li>${summary}</li>
        `;
    }).join('');
    const bearishSummaryList = bearishSummary.map((summary) => {
        return `
            <li>${summary}</li>
        `;
    }).join('');

    return `
        <div class="modal fade" id="insightsModal-${name}" tabindex="-1" aria-labelledby="insightsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">${name} insights</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h4>Sentiment: ${sentiment}</h4>
                        <p></p>
                        <h4>News</h4>
                        <ul class="news">
                            ${newsList}
                        </ul>
                        <h4>The Good</h4>
                        <ul class="the-good">
                            ${bullishSummaryList}
                        </ul>
                        <h4>The Bad</h4>
                        <ul class="the-bad">
                            ${bearishSummaryList}
                        </ul>
                    </div>
                    <!-- <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div> -->
                </div>
            </div>
        </div>
    `;
}


export const newsmodal = (stock) => {
    const { name, news } = stock;
    const articles = news.map((item) => {
        return `
            <h4><a href="${item.url}">${item.title}</a></h4>
            <p>${item.summary}</p>
            <p><em>${item.source}</em></p>
        `;
    }).join('');

    return `
    <div class="modal fade" id="newsModal-${name}" tabindex="-1" aria-labelledby="insightsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">${name} News</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ${articles}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `;
}