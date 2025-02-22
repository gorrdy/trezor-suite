import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { analytics, EventType } from '@trezor/suite-analytics';
import { Card, Textarea, Button, Tooltip, H3, IconButton } from '@trezor/components';

import { Translation } from 'src/components/suite';
import { useDispatch, useTranslation } from 'src/hooks/suite';
import { pushRawTransaction, sendRaw } from 'src/actions/wallet/sendFormActions';
import { getInputState, isHexValid } from '@suite-common/wallet-utils';
import { Network } from 'src/types/wallet';
import { OpenGuideFromTooltip } from 'src/components/guide';
import { spacingsPx } from '@trezor/theme';

const StyledCard = styled(Card)`
    position: relative;
`;

const CloseIcon = styled(IconButton)`
    position: absolute;
    right: ${spacingsPx.md};
    top: ${spacingsPx.md};
`;

const StyledTextarea = styled(Textarea)`
    margin: ${spacingsPx.md} 0 ${spacingsPx.lg};

    > :first-child {
        background-color: ${({ theme }) => theme.backgroundNeutralSubtleOnElevation1};
        border-color: ${({ theme }) => theme.borderOnElevation1};
    }
`;

const SendButton = styled(Button)`
    margin: 0 auto;
    min-width: 120px;
`;

interface RawProps {
    network: Network;
}

export const Raw = ({ network }: RawProps) => {
    const {
        register,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            rawTx: '',
        },
    });
    const dispatch = useDispatch();
    const { translationString } = useTranslation();

    const inputName = 'rawTx';
    const inputValue = getValues(inputName) || '';
    const error = errors[inputName];
    const inputState = getInputState(error);
    const prefix = network.networkType === 'ethereum' ? '0x' : undefined;
    const { ref: inputRef, ...inputField } = register(inputName, {
        required: translationString('RAW_TX_NOT_SET'),
        validate: (value: string) => {
            if (!isHexValid(value, prefix)) return translationString('DATA_NOT_VALID_HEX');
        },
    });

    const cancel = () => dispatch(sendRaw(false));
    const send = async () => {
        const result = await dispatch(pushRawTransaction(inputValue, network.symbol));
        if (result) {
            setValue(inputName, '');
            analytics.report({
                type: EventType.SendRawTransaction,
                payload: {
                    networkSymbol: network.symbol,
                },
            });
        }
    };

    return (
        <StyledCard>
            <H3>
                <Tooltip
                    addon={instance => (
                        <OpenGuideFromTooltip
                            id="/3_send-and-receive/transactions-in-depth/send-raw.md"
                            instance={instance}
                        />
                    )}
                    content={<Translation id="SEND_RAW_TRANSACTION_TOOLTIP" />}
                    dashed
                >
                    <Translation id="SEND_RAW" />
                </Tooltip>
            </H3>

            <CloseIcon variant="tertiary" size="small" icon="CROSS" onClick={cancel} />

            <StyledTextarea
                inputState={inputState}
                data-test={inputName}
                defaultValue={inputValue}
                bottomText={error?.message || null}
                label={<Translation id="RAW_TRANSACTION" />}
                innerRef={inputRef}
                {...inputField}
            />

            <SendButton isDisabled={inputState === 'error' || !inputValue} onClick={send}>
                <Translation id="SEND_TRANSACTION" />
            </SendButton>
        </StyledCard>
    );
};
