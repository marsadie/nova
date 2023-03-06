import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.4/+esm';

const getNews = async (stock) => {
    const response = await axios.get(`https://api.swaggystocks.com/stocks/terminal/research/${stock}`, {
        headers: {
        }
    });
    const data = response.data.data;
    const items = data.map((item) => {
        return {
            title: item.title,
            url: item.news_url,
            image: item.image_url,
            date: item.date,
            summary: item.text,
            sentiment: item.sentiment,
            source: item.source_name,
        }
    });
    const sentiment = () => {
        const counts = items.reduce((acc, item) => {
        if (item.sentiment === 'Positive') {
            acc.positive += 1;
        } else if (item.sentiment === 'Negative') {
            acc.negative += 1;
        } else if (item.sentiment === 'Neutral') {
            acc.neutral += 1;
        }
        return acc;
    }, { positive: 0, negative: 0, neutral: 0 });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};
    return {
        items: items,
        sentiment: sentiment(),
    };
}


export default getNews;