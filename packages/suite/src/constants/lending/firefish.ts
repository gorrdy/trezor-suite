import widgetConfigJson from './firefishWidgetConfig.json';

export const FIREFISH_SUBMIT_URL = 'https://app.firefish.io/borrow/tab/summary';
export const FIREFISH_PARTNER_ID = 'trezor-suite';

export const firefishCurrencies = ['EUR', 'CZK', 'CHF', 'PLN', 'USDC', 'USDT'] as const;
export type FirefishCurrency = (typeof firefishCurrencies)[number];

export const firefishPeriods = [3, 6, 12, 18, 24] as const;
export type FirefishPeriod = (typeof firefishPeriods)[number];

export type ChanceToMatch = 'low' | 'medium' | 'high' | 'very_high' | 'na';
export type LoanType = 'instant' | 'custom' | 'otc';

type InvestTicket = {
    period: number;
    interestRate: string;
    amount: string;
};

type CurrencyConfig = {
    currencyCode: string;
    minTransactionLimit: string;
    maxTransactionLimit: string;
    maxInstantTransactionLimit: string;
    minOtcTransactionLimit: string;
    bitcoinPrice: string;
    minInterestRate: string;
    maxInterestRate: string;
    investTickets: InvestTicket[];
};

type MatchingModel = {
    parameters: { params: number[] };
    preprocessingStats: {
        currencyStats: { currency: string; logAmountMean: number; logAmountStd: number }[];
        interestRateMean: number;
        interestRateStd: number;
        periodMean: number;
        periodStd: number;
    };
    likelihoodBandThresholds: number[];
};

type FirefishWidgetConfig = {
    originationFeeRate: string;
    currencies: CurrencyConfig[];
    matchingModel: MatchingModel;
};

export const firefishWidgetConfig = widgetConfigJson as FirefishWidgetConfig;

export const getFirefishCurrencyConfig = (currency: FirefishCurrency) =>
    firefishWidgetConfig.currencies.find(c => c.currencyCode === currency);
