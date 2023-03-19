import { load } from 'cheerio';
import fetch from 'node-fetch';

export const getMaxPain = async (stock) => {
    const response = await fetch(`https://www.stockninja.io/stocks/${stock}/options/`);
    const $ = load(await response.text());
    const maxPain = $('#max-pain-container .stat-highlight').text().split('$')[1];
    return Number(maxPain);
}

export const getInsights = async (stock) => {
    const response = await fetch(`https://query1.finance.yahoo.com/ws/insights/v2/finance/insights?lang=en-US&region=US&symbol=${stock}&getAllResearchReports=true&reportsCount=2&corsDomain=finance.yahoo.com`);
    const data = response.json();
    return {
        technicalPattern: data.finance.result.events[0].eventType,
        technicalPatternEndDate: data.finance.result.events[0].endDate,
        technicalPatternDirection: data.finance.result.events[0].tradeType,
        resistance: data.finance.result.instrumentInfo.keyTechnicals.resistance ?? 'N/A',
        support: data.finance.result.instrumentInfo.keyTechnicals.support ?? 'N/A',
        stopLoss: data.finance.result.instrumentInfo.keyTechnicals.stopLoss ?? 'N/A',
        sectorShortTermSentiment: data.finance.result.instrumentInfo.technicalEvents.intermediateTermOutlook.sectorScoreDescription ?? 'N/A',
        sectorLongTermSentiment: data.finance.result.instrumentInfo.technicalEvents.longTermOutlook.sectorScoreDescription ?? 'N/A',
        secReports: data.finance.result.secReports,
        bearishSummary: data.finance.result.upsell.msBearishSummary ?? ['N/A'],
        bullishSummary: data.finance.result.upsell.msBullishSummary ?? ['N/A'],
        summaryPublishedDate: data.finance.result.upsell.msBullishBearishSummariesPublishDate,
    }
}