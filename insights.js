import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.4/+esm';
import cheerio from 'https://cdn.jsdelivr.net/npm/cheerio@1.0.0-rc.12/+esm';

export const getMaxPain = async (stock) => {
    const response = await axios.get(`https://www.stockninja.io/stocks/${stock}/options/`, {
        headers: {
            'Content-Type': 'text/html',
        }
    });
    const $ = cheerio.load(response.data);
    const maxPain = $('#max-pain-container .stat-highlight').text().split('$')[1];
    return Number(maxPain);
}

export const getInsights = async (stock) => {
    const response = await axios.get(`https://query1.finance.yahoo.com/ws/insights/v2/finance/insights?lang=en-US&region=US&symbol=${stock}&getAllResearchReports=true&reportsCount=2&corsDomain=finance.yahoo.com`);
    const data = response.data.finance.result;
    return {
        technicalPattern: data.events[0].eventType,
        technicalPatternEndDate: data.events[0].endDate,
        technicalPatternDirection: data.events[0].tradeType,
        resistance: data.instrumentInfo.keyTechnicals.resistance ?? 'N/A',
        support: data.instrumentInfo.keyTechnicals.support ?? 'N/A',
        stopLoss: data.instrumentInfo.keyTechnicals.stopLoss ?? 'N/A',
        sectorShortTermSentiment: data.instrumentInfo.technicalEvents.intermediateTermOutlook.sectorScoreDescription ?? 'N/A',
        sectorLongTermSentiment: data.instrumentInfo.technicalEvents.longTermOutlook.sectorScoreDescription ?? 'N/A',
        secReports: data.secReports,
        bearishSummary: data.upsell.msBearishSummary ?? ['N/A'],
        bullishSummary: data.upsell.msBullishSummary ?? ['N/A'],
        summaryPublishedDate: data.upsell.msBullishBearishSummariesPublishDate,
    }
}