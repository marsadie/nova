import fetch from 'node-fetch';

const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkY3QiOjE2NzUxODc2OTgsImRldmljZV9oYXNoIjoiNzRjZDJlNWY2OWQ3NTY0ZDU4MzgyNzVhZWFiNWYxMzUiLCJleHAiOjE2Nzg4MDUzMjEsImxldmVsMl9hY2Nlc3MiOnRydWUsIm1ldGEiOnsib2lkIjoiYzgyU0gwV1pPc2FiT1hHUDJzeHFjajM0RnhrdmZuV1JaQktsQmpGUyIsIm9uIjoiUm9iaW5ob29kIn0sIm9wdGlvbnMiOnRydWUsInNjb3BlIjoiaW50ZXJuYWwiLCJzZXJ2aWNlX3JlY29yZHMiOlt7ImhhbHRlZCI6ZmFsc2UsInNlcnZpY2UiOiJudW1tdXNfdXMiLCJzaGFyZF9pZCI6MSwic3RhdGUiOiJhdmFpbGFibGUifSx7ImhhbHRlZCI6ZmFsc2UsInNlcnZpY2UiOiJicm9rZWJhY2tfdXMiLCJzaGFyZF9pZCI6NCwic3RhdGUiOiJhdmFpbGFibGUifV0sInRva2VuIjoiMHVJeDRjUjFrSDFGV2FyYmtITEhNWDdzN1RVZE1mIiwidXNlcl9pZCI6IjJlNGE2Njg4LTc0YWQtNGI4MS1hNDA4LTQ5M2E2MTZhNzdjYyIsInVzZXJfb3JpZ2luIjoiVVMifQ.lIodju_H-0GmSoi6von9GwBQTdGp06PIJuYgJfmGlb3B5pvDo3TDHi9QKlZQWX-AlcJl8M34HjtrPhHDyLBCrag4t0kies7CYmCGTy7Ub1iJnychyH8-7HfJXrZoiB0FV3rsZ2CJdcmD4vWukv9ZO-nNLMSCp-uDLA-cC2IDd19EALCz288F0c5VaMttSxaLYiQslTLiKElJgkTA8mT0kaRInfm-RR5FqCl973kVRGgny4iubp8K7QTqM9vmTCi6-9GeCv6QGYT_gwppUVKlKqYwrd7YJE7ZrV_BUPd8mX4Lpneptvbiujr_jtUz2qp_i3kHRpj3th0-grOf6hxGPQ';

const getId = async (stock) => {
    const response = await fetch(`https://api.robinhood.com/instruments/?active_instruments_only=false&symbol=${stock}`, {
        'method': 'GET',
    });
    const data = await response.json();
    return data.results[0].id;
}

const getRSI = async (stock) => {
    const id = await getId(stock);
    const response = await fetch(`https://bonfire.robinhood.com/instruments/${id}/stock-advanced-chart/?display_span=month&hide_extended_hours=false&indicators=%5B%7B%22type%22%3A%22rsi%22%2C%22selected%22%3Atrue%2C%22overbought_level%22%3A70%2C%22oversold_level%22%3A30%2C%22period%22%3A7%7D%5D&show_candlesticks=false`, {
        'method': 'GET',
        'headers': {
            'Authorization': token,
        },
    });
    const data = await response.json();
    return data.legend_data.
}

export default getRSI;


