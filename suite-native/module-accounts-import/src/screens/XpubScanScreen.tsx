import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useFocusEffect } from '@react-navigation/native';

import { Box, Button, HeaderedCard, TextDivider, VStack } from '@suite-native/atoms';
import { isDevelopOrDebugEnv } from '@suite-native/config';
import { Form, TextInputField, useForm } from '@suite-native/forms';
import {
    AccountsImportStackParamList,
    AccountsImportStackRoutes,
    Screen,
    StackProps,
} from '@suite-native/navigation';
import { prepareNativeStyle, useNativeStyles } from '@trezor/styles';
import { getNetworkType } from '@suite-common/wallet-config';
import { isAddressValid, isAddressBasedNetwork } from '@suite-common/wallet-utils';
import { useAlert } from '@suite-native/alerts';
import { useTranslate } from '@suite-native/intl';
import {
    XpubFormContext,
    xpubFormValidationSchema,
    XpubFormValues,
} from '@suite-common/validators';

import { XpubImportSection } from '../components/XpubImportSection';
import { AccountImportSubHeader } from '../components/AccountImportSubHeader';
import { DevXpub } from '../components/DevXpub';
import { SelectableNetworkItem } from '../components/SelectableNetworkItem';
import { XpubHint } from '../components/XpubHint';
import { XpubHintBottomSheet } from '../components/XpubHintBottomSheet';

const FORM_BUTTON_FADE_IN_DURATION = 200;

// Extra padding needed to make multiline xpub input form visible even with the sticky footer.
const EXTRA_KEYBOARD_AVOIDING_VIEW_HEIGHT = 350;

const cameraStyle = prepareNativeStyle(utils => ({
    alignItems: 'center',
    marginTop: 20,
    marginBottom: utils.spacings.medium,
}));

export const XpubScanScreen = ({
    navigation,
    route,
}: StackProps<AccountsImportStackParamList, AccountsImportStackRoutes.XpubScan>) => {
    const { translate } = useTranslate();
    const { applyStyle } = useNativeStyles();
    const [_, setIsCameraRequested] = useState<boolean>(false);
    const { showAlert, hideAlert } = useAlert();

    const { networkSymbol } = route.params;
    const networkType = getNetworkType(networkSymbol);

    const form = useForm<XpubFormValues, XpubFormContext>({
        validation: xpubFormValidationSchema,
        context: { networkSymbol },
    });
    const { handleSubmit, setValue, watch, reset } = form;
    const watchXpubAddress = watch('xpubAddress');
    const [isHintSheetVisible, setIsHintSheetVisible] = useState(false);

    const isXpubFormFilled = watchXpubAddress?.length > 0;

    const resetToDefaultValues = useCallback(() => {
        setIsCameraRequested(false);
    }, []);

    useFocusEffect(resetToDefaultValues);

    const inputLabel = translate(
        isAddressBasedNetwork(networkType)
            ? 'moduleAccountImport.xpubScanScreen.input.label.address'
            : 'moduleAccountImport.xpubScanScreen.input.label.xpub',
    );

    const goToAccountImportScreen = ({ xpubAddress }: XpubFormValues) => {
        if (
            xpubAddress &&
            !isAddressBasedNetwork(networkType) &&
            isAddressValid(xpubAddress, networkSymbol)
        ) {
            // we need to set timeout to avoid showing alert during screen transition, otherwise it will freeze the app
            setTimeout(() => {
                showAlert({
                    title: translate('moduleAccountImport.xpubScanScreen.alert.address.title'),
                    description: translate(
                        'moduleAccountImport.xpubScanScreen.alert.address.description',
                    ),
                    icon: 'warningCircle',
                    pictogramVariant: 'red',
                    primaryButtonTitle: translate(
                        'moduleAccountImport.xpubScanScreen.confirmButton',
                    ),
                    onPressPrimaryButton: () => null,
                    secondaryButtonTitle: translate(
                        'moduleAccountImport.xpubScanScreen.alert.address.hintButton',
                    ),
                    onPressSecondaryButton: () => {
                        hideAlert();
                        setIsHintSheetVisible(true);
                    },
                });
            }, 1000);
            return;
        }

        navigation.navigate(AccountsImportStackRoutes.AccountImportLoading, {
            xpubAddress,
            networkSymbol,
        });
    };

    const onXpubFormSubmit = handleSubmit(goToAccountImportScreen);

    const handleXpubResult = useCallback(
        (xpubAddress?: string) => {
            if (xpubAddress && xpubAddress !== watchXpubAddress) {
                setValue('xpubAddress', xpubAddress);
                onXpubFormSubmit();
            }
        },
        [watchXpubAddress, setValue, onXpubFormSubmit],
    );

    useEffect(() => {
        if (route?.params?.qrCode) {
            handleXpubResult(route?.params?.qrCode);
        }
    }, [handleXpubResult, route.params]);

    const handleRequestCamera = () => {
        reset({
            xpubAddress: '',
        });
        navigation.navigate(AccountsImportStackRoutes.XpubScanModal, {
            networkSymbol,
        });
    };

    const handleOpenHint = () => setIsHintSheetVisible(true);
    const handleGoBack = () => navigation.goBack();

    return (
        <Screen
            screenHeader={<AccountImportSubHeader />}
            footer={<XpubHint networkType={networkType} handleOpen={handleOpenHint} />}
            extraKeyboardAvoidingViewHeight={EXTRA_KEYBOARD_AVOIDING_VIEW_HEIGHT}
        >
            <HeaderedCard
                title="Coin to sync"
                buttonTitle="Change"
                buttonIcon="discover"
                onButtonPress={handleGoBack}
            >
                <SelectableNetworkItem symbol={networkSymbol} />
            </HeaderedCard>
            <Box marginHorizontal="medium">
                <View style={applyStyle(cameraStyle)}>
                    <XpubImportSection
                        onRequestCamera={handleRequestCamera}
                        networkSymbol={networkSymbol}
                    />
                </View>

                <TextDivider title="OR" />
                <Form form={form}>
                    <VStack spacing="medium">
                        <TextInputField
                            testID="@accounts-import/sync-coins/xpub-input"
                            name="xpubAddress"
                            label={inputLabel}
                            accessibilityLabel={inputLabel}
                            multiline
                        />
                        {isXpubFormFilled && (
                            <Animated.View entering={FadeIn.duration(FORM_BUTTON_FADE_IN_DURATION)}>
                                <Button
                                    testID="@accounts-import/sync-coins/xpub-submit"
                                    onPress={onXpubFormSubmit}
                                    size="large"
                                >
                                    Confirm
                                </Button>
                            </Animated.View>
                        )}
                    </VStack>
                </Form>
                {isDevelopOrDebugEnv() && (
                    <DevXpub symbol={networkSymbol} onSelect={goToAccountImportScreen} />
                )}
            </Box>
            <XpubHintBottomSheet
                networkType={networkType}
                isVisible={isHintSheetVisible}
                handleClose={() => setIsHintSheetVisible(false)}
            />
        </Screen>
    );
};
