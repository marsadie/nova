export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const prediction = (occ, openInterest, allCalls, allPuts, bidDollars, askDollars) => {
    const ticker = occ.slice(0, 3);
    const date = (() => {
        const string = occ.slice(-15).split(/(C|P)/)[0];
        const month = string.slice(2, 4).charAt(0) === '0' ? string.slice(3, 4) : string.slice(2, 4);
        const day = string.slice(4, 6).charAt(0) === '0' ? string.slice(5, 6) : string.slice(4, 6);
        return `${month}/${day}`;
    })();
    const strike = formatter.format(Number(occ.slice(-6, -1)) / 100);
    const type = occ.slice(-15).includes('C') ? 'call' : 'put';
    const hot = bidDollars > askDollars + 20000000 ? 'put' : askDollars > bidDollars + 20000000 ? 'call' : '';
    console.log(ticker, ((openInterest * 100) / (allCalls + allPuts)) * 100 +"%")
    return {
        date: date,
        strike: strike,
        type: type,
        string: `${date} ${type}s`,
        hot: type && hot,
    };
}