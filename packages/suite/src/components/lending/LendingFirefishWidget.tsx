import { useMemo, useState } from 'react';

import { Translation, type TranslationKey } from '@suite/intl';
import { goto } from '@suite/router';
import { selectFiatRatesByFiatRateKey } from '@suite-common/wallet-core';
import { getFiatRateKey } from '@suite-common/wallet-utils';
import {
    Badge,
    type BadgeIntent,
    Banner,
    Button,
    Card,
    Column,
    H3,
    Input,
    Paragraph,
    Range,
    Row,
    Select,
    SelectBar,
    Text,
} from '@trezor/components';

import {
    FIREFISH_PARTNER_ID,
    FIREFISH_SUBMIT_URL,
    type FirefishCurrency,
    type FirefishPeriod,
    firefishCurrencies,
    firefishPeriods,
    firefishWidgetConfig,
} from 'src/constants/lending/firefish';
import { useDispatch, useSelector } from 'src/hooks/suite';
import {
    computeFirefishChanceToMatch,
    getFirefishAmountLimits,
    getFirefishInstantRate,
    getFirefishLoanType,
} from 'src/utils/lending/firefish';

const currencyOptions = firefishCurrencies.map(value => ({ value, label: value }));
type CurrencyOption = { value: FirefishCurrency; label: string };
const periodOptions = firefishPeriods.map(value => ({ value, label: `${value} mo` }));

const chanceLabels: Record<ReturnType<typeof computeFirefishChanceToMatch>, TranslationKey> = {
    low: 'TR_LENDING_FIREFISH_FORM_CHANCE_LOW',
    medium: 'TR_LENDING_FIREFISH_FORM_CHANCE_MEDIUM',
    high: 'TR_LENDING_FIREFISH_FORM_CHANCE_HIGH',
    very_high: 'TR_LENDING_FIREFISH_FORM_CHANCE_VERY_HIGH',
    na: 'TR_LENDING_FIREFISH_FORM_CHANCE_NA',
};

const chanceIntents: Record<ReturnType<typeof computeFirefishChanceToMatch>, BadgeIntent> = {
    low: 'critical',
    medium: 'warning',
    high: 'info',
    very_high: 'brand',
    na: 'neutral',
};

const loanTypeLabels = {
    instant: 'TR_LENDING_FIREFISH_FORM_TYPE_INSTANT',
    custom: 'TR_LENDING_FIREFISH_FORM_TYPE_CUSTOM',
    otc: 'TR_LENDING_FIREFISH_FORM_TYPE_OTC',
} as const;

const fiatCodeForCurrency = (currency: FirefishCurrency) => {
    switch (currency) {
        case 'EUR':
            return 'eur' as const;
        case 'CZK':
            return 'czk' as const;
        case 'CHF':
            return 'chf' as const;
        case 'PLN':
            return 'pln' as const;
        case 'USDC':
        case 'USDT':
            return 'usd' as const;
    }
};

const formatFiat = (value: number, currency: FirefishCurrency) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency === 'USDC' || currency === 'USDT' ? 'USD' : currency,
        maximumFractionDigits: 0,
    }).format(value);

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const LendingFirefishWidget = () => {
    const dispatch = useDispatch();

    const [currency, setCurrency] = useState<FirefishCurrency>('EUR');
    const [amountInput, setAmountInput] = useState('10000');
    const [period, setPeriod] = useState<FirefishPeriod>(12);
    const [customRate, setCustomRate] = useState('6');
    const [email, setEmail] = useState('');

    const amount = Number.parseFloat(amountInput);
    const isAmountValid = Number.isFinite(amount) && amount > 0;
    const limits = getFirefishAmountLimits(currency);

    const btcRate = useSelector(state =>
        selectFiatRatesByFiatRateKey(state, getFiatRateKey('btc', fiatCodeForCurrency(currency))),
    );
    const btcPrice = btcRate?.rate ?? limits?.fallbackBtcPrice;

    const loanType = useMemo(
        () => (isAmountValid ? getFirefishLoanType(amount, currency) : 'custom'),
        [amount, currency, isAmountValid],
    );

    const instantRate = useMemo(() => getFirefishInstantRate(currency, period), [currency, period]);

    const effectiveRate =
        loanType === 'instant' && instantRate !== undefined
            ? instantRate
            : Number.parseFloat(customRate);
    const isRateValid = Number.isFinite(effectiveRate) && effectiveRate > 0;

    const chance = useMemo(() => {
        if (!isAmountValid || !isRateValid) return 'na' as const;

        return computeFirefishChanceToMatch({
            amount,
            interestRate: effectiveRate,
            period,
            currency,
        });
    }, [amount, effectiveRate, period, currency, isAmountValid, isRateValid]);

    const hasAmountOutOfRange =
        limits !== undefined && isAmountValid && (amount < limits.min || amount > limits.max);
    let amountError: TranslationKey | null = null;
    if (!isAmountValid) {
        amountError = 'TR_LENDING_FIREFISH_FORM_AMOUNT_ERROR';
    } else if (hasAmountOutOfRange) {
        amountError = 'TR_LENDING_FIREFISH_FORM_AMOUNT_RANGE_ERROR';
    }

    const isEmailValid = isValidEmail(email);
    const canSubmit = isAmountValid && !hasAmountOutOfRange && isRateValid && isEmailValid;

    const goBack = () => dispatch(goto({ routeName: 'suite-lending' }));

    const continueToFirefish = () => {
        if (!canSubmit) return;

        const params = new URLSearchParams({
            currency,
            amount: amountInput.trim(),
            period: String(period),
            type: loanType,
            rate: String(effectiveRate),
            chance_to_match: chance,
            origination_fee_rate: firefishWidgetConfig.originationFeeRate,
            email: email.trim(),
            partner: FIREFISH_PARTNER_ID,
        });
        if (btcPrice !== undefined) {
            params.set('btc_price', btcPrice.toFixed(5));
        }
        window.open(`${FIREFISH_SUBMIT_URL}?${params.toString()}`, '_blank', 'noopener,noreferrer');
    };

    const collateralBtc = btcPrice && isAmountValid ? amount / btcPrice : undefined;

    return (
        <Column gap={16} maxWidth={640}>
            <Row gap={12} alignItems="center" justifyContent="space-between">
                <Button
                    intent="neutral"
                    priority="secondary"
                    size="small"
                    iconLeft="arrowLeft"
                    onClick={goBack}
                >
                    <Translation id="TR_LENDING_BACK_TO_PROVIDERS" />
                </Button>
                <H3>Firefish</H3>
            </Row>

            <Card>
                <Column gap={24}>
                    <Column gap={4}>
                        <H3>
                            <Translation id="TR_LENDING_FIREFISH_FORM_TITLE" />
                        </H3>
                        <Paragraph typographyStyle="body-sm">
                            <Translation id="TR_LENDING_FIREFISH_FORM_SUBTITLE" />
                        </Paragraph>
                    </Column>

                    <Column gap={16}>
                        <Select
                            label={<Translation id="TR_LENDING_FIREFISH_FORM_CURRENCY_LABEL" />}
                            options={currencyOptions}
                            value={currencyOptions.find(option => option.value === currency)}
                            onChange={(selected: CurrencyOption) => setCurrency(selected.value)}
                            isClearable={false}
                            isSearchable={false}
                        />

                        <Input
                            label={<Translation id="TR_LENDING_FIREFISH_FORM_AMOUNT_LABEL" />}
                            inputMode="decimal"
                            type="number"
                            min={limits?.min}
                            max={limits?.max}
                            step={100}
                            value={amountInput}
                            onChange={event => setAmountInput(event.target.value)}
                            rightContent={<Text typographyStyle="body-md-strong">{currency}</Text>}
                            bottomText={
                                amountError ? (
                                    <Translation
                                        id={amountError}
                                        values={
                                            amountError ===
                                            'TR_LENDING_FIREFISH_FORM_AMOUNT_RANGE_ERROR'
                                                ? {
                                                      min: formatFiat(limits?.min ?? 0, currency),
                                                      max: formatFiat(limits?.max ?? 0, currency),
                                                  }
                                                : undefined
                                        }
                                    />
                                ) : undefined
                            }
                            hasError={!!amountError}
                        />

                        <Column gap={8}>
                            <Text typographyStyle="body-sm">
                                <Translation id="TR_LENDING_FIREFISH_FORM_PERIOD_LABEL" />
                            </Text>
                            <SelectBar
                                options={periodOptions}
                                selectedOption={period}
                                onChange={value => setPeriod(value)}
                                isFullWidth
                            />
                        </Column>

                        {loanType === 'custom' && limits !== undefined && (
                            <Column gap={8}>
                                <Row gap={8} alignItems="center" justifyContent="space-between">
                                    <Text typographyStyle="body-sm">
                                        <Translation id="TR_LENDING_FIREFISH_FORM_RATE_LABEL" />
                                    </Text>
                                    <Text typographyStyle="body-md-strong">
                                        {Number.isFinite(Number.parseFloat(customRate))
                                            ? `${Number.parseFloat(customRate).toFixed(1)}%`
                                            : '—'}
                                    </Text>
                                </Row>
                                <Range
                                    min={limits.minRate}
                                    max={limits.maxRate}
                                    step="0.1"
                                    value={
                                        Number.isFinite(Number.parseFloat(customRate))
                                            ? Number.parseFloat(customRate)
                                            : limits.minRate
                                    }
                                    onChange={event => setCustomRate(event.target.value)}
                                />
                                <Row gap={8} justifyContent="space-between">
                                    <Text typographyStyle="body-xs">{limits.minRate}%</Text>
                                    <Text typographyStyle="body-xs">{limits.maxRate}%</Text>
                                </Row>
                            </Column>
                        )}

                        {loanType === 'instant' && instantRate !== undefined && (
                            <Banner
                                icon="lightning"
                                intent="brand"
                                title={
                                    <Translation
                                        id="TR_LENDING_FIREFISH_FORM_TYPE_INSTANT_RATE"
                                        values={{ rate: instantRate.toFixed(2) }}
                                    />
                                }
                                description={
                                    <Translation id="TR_LENDING_FIREFISH_FORM_TYPE_INSTANT_DESC" />
                                }
                            />
                        )}

                        {loanType === 'otc' && (
                            <Banner
                                icon="info"
                                intent="info"
                                title={<Translation id="TR_LENDING_FIREFISH_FORM_TYPE_OTC_TITLE" />}
                                description={
                                    <Translation id="TR_LENDING_FIREFISH_FORM_TYPE_OTC_DESC" />
                                }
                            />
                        )}

                        <Input
                            label={<Translation id="TR_LENDING_FIREFISH_FORM_EMAIL_LABEL" />}
                            type="email"
                            inputMode="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            bottomText={
                                email.length > 0 && !isEmailValid ? (
                                    <Translation id="TR_LENDING_FIREFISH_FORM_EMAIL_ERROR" />
                                ) : undefined
                            }
                            hasError={email.length > 0 && !isEmailValid}
                        />
                    </Column>

                    <Row gap={8} alignItems="center" justifyContent="space-between">
                        <Row gap={8} alignItems="center">
                            <Text typographyStyle="body-sm">
                                <Translation id="TR_LENDING_FIREFISH_FORM_CHANCE_TO_MATCH" />
                            </Text>
                            <Badge intent={chanceIntents[chance]}>
                                <Translation id={chanceLabels[chance]} />
                            </Badge>
                        </Row>
                        <Badge intent="neutral">
                            <Translation id={loanTypeLabels[loanType]} />
                        </Badge>
                    </Row>

                    <Banner
                        icon="info"
                        intent="info"
                        title={
                            collateralBtc !== undefined ? (
                                <Translation
                                    id="TR_LENDING_FIREFISH_FORM_COLLATERAL_LINE"
                                    values={{
                                        amount: formatFiat(amount, currency),
                                        btc: collateralBtc.toFixed(4),
                                    }}
                                />
                            ) : (
                                <Translation id="TR_LENDING_FIREFISH_FORM_COLLATERAL_UNKNOWN" />
                            )
                        }
                        description={<Translation id="TR_LENDING_FIREFISH_FORM_COLLATERAL_NOTE" />}
                    />

                    <Row gap={8} justifyContent="flex-end">
                        <Button
                            intent="brand"
                            priority="primary"
                            iconRight="arrowSquareOut"
                            isDisabled={!canSubmit}
                            onClick={continueToFirefish}
                        >
                            <Translation id="TR_LENDING_FIREFISH_FORM_CONTINUE" />
                        </Button>
                    </Row>
                </Column>
            </Card>

            <Text typographyStyle="body-xs">
                <Translation id="TR_LENDING_FIREFISH_FORM_DISCLAIMER" />
            </Text>
        </Column>
    );
};
