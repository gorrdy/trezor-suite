import { P2pProviderInfo, P2pQuote, P2pQuotesRequest } from 'invity-api';

import type { Timer } from '@trezor/react-utils';

import type { AppState } from 'src/types/suite';
import type { Account } from 'src/types/wallet';
import { WithSelectedAccountLoadedProps } from 'src/components/wallet';

export type UseOffersProps = WithSelectedAccountLoadedProps;

export enum P2pStep {
    GET_STARTED,
    RECEIVING_ADDRESS,
}

export type ContextValues = {
    device: AppState['device']['selectedDevice'];
    account: Account;
    providers?: { [name: string]: P2pProviderInfo };
    timer: Timer;
    quotesRequest?: P2pQuotesRequest;
    quotes?: P2pQuote[];
    selectQuote: (quote: P2pQuote) => void;
    selectedQuote?: P2pQuote;
    p2pStep: P2pStep;
    goToProvider: () => void;
    callInProgress: boolean;
    providerVisited: boolean;
    goToReceivingAddress: () => void;
};
