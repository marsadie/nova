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

export const insightsmodal = async (stock) => {
    const { ticker, company, news } = stock;
    const newsList = news.items.slice(0, 3).map((item) => {
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

    return `
        <div class="modal fade" id="insightsModal-${ticker}" tabindex="-1" aria-labelledby="insightsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">${company}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="news">
                            ${newsList}
                        </ul>
                    </div>
                    <!-- <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div> -->
                </div>
            </div>
        </div>
    `;
};