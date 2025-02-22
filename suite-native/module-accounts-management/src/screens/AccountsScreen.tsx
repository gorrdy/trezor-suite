import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

import { DeviceManagerScreenHeader } from '@suite-native/device-manager';
import {
    RootStackParamList,
    RootStackRoutes,
    Screen,
    StackNavigationProps,
} from '@suite-native/navigation';
import { AccountsList, SearchableAccountsListScreenHeader } from '@suite-native/accounts';
import { AccountKey, TokenAddress } from '@suite-common/wallet-types';
import {
    selectAreAllDevicesDisconnectedOrAccountless,
    selectIsPortfolioTrackerDevice,
} from '@suite-common/wallet-core';

import { AddAccountButton } from '../components/AddAccountsButton';

export const AccountsScreen = () => {
    const navigation =
        useNavigation<StackNavigationProps<RootStackParamList, RootStackRoutes.AccountDetail>>();

    const isPortfolioTrackerDevice = useSelector(selectIsPortfolioTrackerDevice);
    const areAllDevicesDisconnectedOrAccountless = useSelector(
        selectAreAllDevicesDisconnectedOrAccountless,
    );

    const [accountsFilterValue, setAccountsFilterValue] = useState<string>('');

    const handleSelectAccount = (accountKey: AccountKey, tokenContract?: TokenAddress) => {
        navigation.navigate(RootStackRoutes.AccountDetail, {
            accountKey,
            tokenContract,
        });
    };

    const handleFilterChange = (value: string) => {
        setAccountsFilterValue(value);
    };

    return (
        <Screen
            screenHeader={<DeviceManagerScreenHeader />}
            subheader={
                <SearchableAccountsListScreenHeader
                    title="My assets"
                    onSearchInputChange={handleFilterChange}
                    rightIcon={
                        isPortfolioTrackerDevice &&
                        !areAllDevicesDisconnectedOrAccountless && <AddAccountButton />
                    }
                />
            }
        >
            <AccountsList onSelectAccount={handleSelectAccount} filterValue={accountsFilterValue} />
        </Screen>
    );
};
