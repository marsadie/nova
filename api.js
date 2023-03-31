//import * as dotenv from 'dotenv';
//import fetch from 'node-fetch';

// dotenv.config();

// const url = process.env.API_URL;
// const key = process.env.API_KEY;

const getStocks = async () => {
    const refreshToken = await fetch('https://us-east-2.aws.realm.mongodb.com/api/client/v2.0/auth/session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RhdGEiOm51bGwsImJhYXNfZGV2aWNlX2lkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwiYmFhc19kb21haW5faWQiOiI2NDBlMGFkNjFkYzA0YTMyMTcyYzBjNWMiLCJiYWFzX2lkIjoiNjQxOGFlOTk3Y2Q3NGJhODBhOWViMjYyIiwiYmFhc19pZGVudGl0eSI6eyJpZCI6IjY0MGUyOTNjNWYzZjE2ZDA5NTgyODM2YyIsInByb3ZpZGVyX3R5cGUiOiJhcGkta2V5IiwicHJvdmlkZXJfaWQiOiI2NDBlMGFkZWUzZTU1NDlkZWJlMGRlNWYifSwiZXhwIjoxNjg0NTIzMTYxLCJpYXQiOjE2NzkzMzkxNjEsInN0aXRjaF9kYXRhIjpudWxsLCJzdGl0Y2hfZGV2SWQiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJzdGl0Y2hfZG9tYWluSWQiOiI2NDBlMGFkNjFkYzA0YTMyMTcyYzBjNWMiLCJzdGl0Y2hfaWQiOiI2NDE4YWU5OTdjZDc0YmE4MGE5ZWIyNjIiLCJzdGl0Y2hfaWRlbnQiOnsiaWQiOiI2NDBlMjkzYzVmM2YxNmQwOTU4MjgzNmMiLCJwcm92aWRlcl90eXBlIjoiYXBpLWtleSIsInByb3ZpZGVyX2lkIjoiNjQwZTBhZGVlM2U1NTQ5ZGViZTBkZTVmIn0sInN1YiI6IjY0MGUyOTNjNWYzZjE2ZDA5NTgyODM2OCIsInR5cCI6InJlZnJlc2gifQ.oWMx8m3pnuc2-jENeOTMIb8yEyz8esrWyhqyNTTI0R4',
        }
    });
    const refreshTokenJson = await refreshToken.json();
    const token = refreshTokenJson.access_token;
    const response = await fetch(`https://us-east-2.aws.data.mongodb-api.com/app/data-mvytn/endpoint/data/v1/action/find`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            "collection": "stocks",
            "database": "appDB",
            "dataSource": "starwin",
        }),
    });
    const data = await response.json();
    console.log(data.documents.map(stock => (stock.ticker + stock.relVolume)));
    const sorted = data.documents
        .filter(stock => stock.relVolume > 1 && stock.bidPrice > 0 && Math.abs(stock.delta) > Math.abs(stock.theta))
        .sort((a, b) => (b.relVolume - a.relVolume));
    return sorted;
}

export default getStocks;