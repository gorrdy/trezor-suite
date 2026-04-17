import {
    type ChanceToMatch,
    type FirefishCurrency,
    type FirefishPeriod,
    type LoanType,
    firefishCurrencies,
    firefishWidgetConfig,
    getFirefishCurrencyConfig,
} from 'src/constants/lending/firefish';

const MODEL_CURRENCY_ORDER = [...firefishCurrencies].sort();

const sigmoid = (x: number) => {
    const clipped = Math.max(-500, Math.min(500, x));

    return 1 / (1 + Math.exp(-clipped));
};

type ChanceInput = {
    amount: number;
    interestRate: number;
    period: FirefishPeriod;
    currency: FirefishCurrency;
};

export const computeFirefishChanceToMatch = (input: ChanceInput): ChanceToMatch => {
    if (!Number.isFinite(input.amount) || input.amount <= 0) return 'na';
    if (!Number.isFinite(input.interestRate) || input.interestRate <= 0) return 'na';

    const model = firefishWidgetConfig.matchingModel;
    const weights = model.parameters.params;
    const thresholds = model.likelihoodBandThresholds;
    const stats = model.preprocessingStats;

    const currencyEntry =
        stats.currencyStats.find(entry => entry.currency === input.currency) ??
        stats.currencyStats.find(entry => entry.currency === 'EUR');
    if (!currencyEntry) return 'na';

    const logAmount = Math.log(Math.max(1000, input.amount));
    const normalizedLogAmount =
        (logAmount - currencyEntry.logAmountMean) / currencyEntry.logAmountStd;
    const normalizedInterestRate =
        (input.interestRate - stats.interestRateMean) / stats.interestRateStd;
    const normalizedPeriod = (input.period - stats.periodMean) / stats.periodStd;

    const currencyOneHot = MODEL_CURRENCY_ORDER.map(currency =>
        currency === input.currency ? 1 : 0,
    );
    const features = [
        normalizedLogAmount,
        normalizedInterestRate,
        normalizedPeriod,
        ...currencyOneHot,
    ];
    if (features.some(f => !Number.isFinite(f))) return 'na';

    const augmented = [1, ...features];
    const score = augmented.reduce((sum, feature, i) => sum + feature * weights[i], 0);
    const probability = sigmoid(score);
    if (!Number.isFinite(probability)) return 'na';

    if (probability < thresholds[0]) return 'low';
    if (probability < thresholds[1]) return 'medium';
    if (probability < thresholds[2]) return 'high';

    return 'very_high';
};

export const getFirefishLoanType = (amount: number, currency: FirefishCurrency): LoanType => {
    const config = getFirefishCurrencyConfig(currency);
    if (!config) return 'custom';

    const minOtc = Number.parseFloat(config.minOtcTransactionLimit);
    const maxInstant = Number.parseFloat(config.maxInstantTransactionLimit);

    if (amount >= minOtc) return 'otc';
    if (amount <= maxInstant && config.investTickets.length > 0) return 'instant';

    return 'custom';
};

export const getFirefishInstantRate = (
    currency: FirefishCurrency,
    period: FirefishPeriod,
): number | undefined => {
    const config = getFirefishCurrencyConfig(currency);
    const ticket = config?.investTickets.find(t => t.period === period);
    if (!ticket) return undefined;

    return Number.parseFloat(ticket.interestRate);
};

export const getFirefishAmountLimits = (currency: FirefishCurrency) => {
    const config = getFirefishCurrencyConfig(currency);
    if (!config) return undefined;

    return {
        min: Number.parseFloat(config.minTransactionLimit),
        max: Number.parseFloat(config.maxTransactionLimit),
        minRate: Number.parseFloat(config.minInterestRate),
        maxRate: Number.parseFloat(config.maxInterestRate),
        fallbackBtcPrice: Number.parseFloat(config.bitcoinPrice),
    };
};
