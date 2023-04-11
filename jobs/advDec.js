import fetch from 'node-fetch';

const advancersDecliners = async () => {
    const response = await fetch('https://www.wsj.com/market-data/stocks/marketsdiary?id=%7B"application"%3A"WSJ"%2C"marketsDiaryType"%3A"diaries"%7D&type=mdc_marketsdiary');
    const data = await response.json();
    const advancers = Number(data.data.instrumentSets[0].instruments[1].latestClose.replace(',', '')) + Number(data.data.instrumentSets[1].instruments[1].latestClose.replace(',', ''));
    const decliners = Number(data.data.instrumentSets[0].instruments[2].latestClose.replace(',', '')) + Number(data.data.instrumentSets[1].instruments[2].latestClose.replace(',', ''));
    console.log('advancers', advancers, 'decliners', decliners);
    return {
        advancers: advancers,
        decliners: decliners,
    }
}

export default advancersDecliners;