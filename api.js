//import * as dotenv from 'dotenv';
//import fetch from 'node-fetch';

// dotenv.config();

// const url = process.env.API_URL;
// const key = process.env.API_KEY;

const getStocks = async () => {
    const response = await fetch(`https://us-east-2.aws.data.mongodb-api.com/app/data-mvytn/endpoint/data/v1/action/find`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': 'uHmzyp7RyHlC5k4tZvosXvmvHSy8hkrH0h4CaF60klSw9LXl0dp2Rd3ss2H5XF2w',
        },
        body: JSON.stringify({
            "collection": "stocks",
            "database": "appDB",
            "dataSource": "starwin",
        }),
    });
    const data = await response.json();
    const documents = data.documents
    .sort((a, b) => (Math.max(b.bidDollars, b.askDollars) - Math.min(b.bidDollars, b.askDollars)) - (Math.max(a.bidDollars, a.askDollars) - Math.min(a.bidDollars, a.askDollars)))
    .filter((stock) => stock.volume >= 1 && Math.max(stock.bidDollars, stock.askDollars) - Math.min(stock.bidDollars, stock.askDollars) > 10000000);
    return documents.length == 0 ? data.documents
    .filter((stock) => stock.volume >= 1) : documents;
}

export default getStocks;