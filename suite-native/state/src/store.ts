import { configureStore, Middleware } from '@reduxjs/toolkit';

import { prepareFiatRatesMiddleware } from '@suite-native/fiat-rates';
import { messageSystemMiddleware } from '@suite-native/message-system';
import { prepareButtonRequestMiddleware, prepareDeviceMiddleware } from '@suite-native/device';
import { prepareDiscoveryMiddleware } from '@suite-native/discovery';
import { prepareTransactionCacheMiddleware } from '@suite-native/accounts';
import { blockchainMiddleware } from '@suite-native/blockchain';

import { extraDependencies } from './extraDependencies';
import { prepareRootReducers } from './reducers';

const middlewares: Middleware[] = [
    messageSystemMiddleware,
    blockchainMiddleware,
    prepareFiatRatesMiddleware(extraDependencies),
    prepareDeviceMiddleware(extraDependencies),
    prepareButtonRequestMiddleware(extraDependencies),
    prepareDiscoveryMiddleware(extraDependencies),
    prepareTransactionCacheMiddleware(extraDependencies),
];

export const initStore = async () =>
    configureStore({
        reducer: await prepareRootReducers(),
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: extraDependencies,
                },
                serializableCheck: false,
                immutableCheck: false,
            }).concat(middlewares),
    });
