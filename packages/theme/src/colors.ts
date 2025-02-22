// If you want to add of modify colors, please read README.md to find out more.

import { Elevation } from './elevation';
import { CSSColor } from './types';

// --------- Background ---------

const backgroundElevationColors = {
    standard: {
        backgroundSurfaceElevationNegative: '#eeeeeeff',
        backgroundSurfaceElevation0: '#f6f6f6ff',
        backgroundSurfaceElevation1: '#ffffffff',
        backgroundSurfaceElevation2: '#f6f6f6ff',
        backgroundSurfaceElevation3: '#ffffffff',
    },
    dark: {
        backgroundSurfaceElevationNegative: '#000000ff',
        backgroundSurfaceElevation0: '#0a0a0aff',
        backgroundSurfaceElevation1: '#161716ff',
        backgroundSurfaceElevation2: '#1c1e1cff',
        backgroundSurfaceElevation3: '#242524ff',
    },
} as const;

export type BackgroundElevationColor = keyof typeof backgroundElevationColors.standard;

export const mapElevationToBackground: Record<Elevation, BackgroundElevationColor> = {
    '-1': 'backgroundSurfaceElevationNegative', // For example left menu is negative elevation
    0: 'backgroundSurfaceElevation0',
    1: 'backgroundSurfaceElevation1',
    2: 'backgroundSurfaceElevation2',
    3: 'backgroundSurfaceElevation3',
};

// --------- Buttons ---------

const backgroundTertiaryElevationColors = {
    standard: {
        backgroundTertiaryElevationNegative: '#f6f6f6ff', // @TODO
        backgroundTertiaryDefaultOnElevation0: '#eeeeeeff',
        backgroundTertiaryDefaultOnElevation1: '#f6f6f6ff',
        backgroundTertiaryDefaultOnElevation2: '#eeeeeeff', // @TODO
        backgroundTertiaryDefaultOnElevation3: '#f6f6f6ff', // @TODO
    },
    dark: {
        backgroundTertiaryElevationNegative: '#1c1e1cff', // @TODO
        backgroundTertiaryDefaultOnElevation0: '#161716ff',
        backgroundTertiaryDefaultOnElevation1: '#1c1e1cff',
        backgroundTertiaryDefaultOnElevation2: '#161716ff', // @TODO
        backgroundTertiaryDefaultOnElevation3: '#1c1e1cff', // @TODO
    },
} as const;

export type BackgroundTertiaryElevationColor =
    keyof typeof backgroundTertiaryElevationColors.standard;

// --------- Borders ---------

const borderElevationColors = {
    standard: {
        borderOnNegative: '#eeeeeeff',
        borderOnElevation0: '#e2e2e2ff',
        borderOnElevation1: '#eeeeeeff',
        borderOnElevation2: '#e2e2e2ff',
        borderOnElevation3: '#eeeeeeff',
    },
    dark: {
        borderOnNegative: '#242524ff',
        borderOnElevation0: '#1c1e1cff',
        borderOnElevation1: '#242524ff',
        borderOnElevation2: '#1c1e1cff',
        borderOnElevation3: '#242524ff',
    },
} as const;

export type BorderElevationColor = keyof typeof borderElevationColors.standard;

export const mapElevationToBorder: Record<Elevation, BorderElevationColor> = {
    '-1': 'borderOnNegative', // For example left menu is negative elevation
    0: 'borderOnElevation0',
    1: 'borderOnElevation1',
    2: 'borderOnElevation2',
    3: 'borderOnElevation3',
};

// ---------------------------

// @TODO create iconDefaultInverse (packages/suite/src/components/suite/banners/Banner.tsx)

export const colorVariants = {
    standard: {
        transparent: '#00000000',
        backgroundPrimaryDefault: '#0f6148ff',
        backgroundPrimaryPressed: '#0a4231ff',
        backgroundPrimarySubtleOnElevation0: '#d6efe8ff',
        backgroundPrimarySubtleOnElevation1: '#f0f9f6ff',
        backgroundSecondaryDefault: '#00854dff',
        backgroundSecondaryPressed: '#004d2dff',
        backgroundTertiaryPressedOnElevation0: '#e2e2e2ff',
        backgroundTertiaryPressedOnElevation1: '#eeeeeeff',
        backgroundNeutralBold: '#171717ff',
        backgroundNeutralSubdued: '#cbcbcbff',
        backgroundNeutralDisabled: '#eeeeeeff',
        backgroundNeutralSubtleOnElevation0: '#eeeeeeff',
        backgroundNeutralSubtleOnElevation1: '#f6f6f6ff',
        backgroundAlertRedBold: '#cd4949ff',
        backgroundAlertRedSubtleOnElevation0: '#f3d3d3ff',
        backgroundAlertRedSubtleOnElevation1: '#fbefefff',
        backgroundAlertYellowBold: '#f7bf2fff',
        backgroundAlertYellowSubtleOnElevation0: '#fdeec9ff',
        backgroundAlertYellowSubtleOnElevation1: '#fef9ebff',
        backgroundAlertBlueBold: '#0078acff',
        backgroundAlertBlueSubtleOnElevation0: '#d5e9f1ff',
        backgroundAlertBlueSubtleOnElevation1: '#f0f7faff',
        backGroundOnboardingCard: '#FFFFFFBD',
        textDefault: '#171717ff',
        textDefaultInverse: '#ffffffff',
        textSubdued: '#616161ff',
        textSecondaryHighlight: '#00854dff',
        textOnPrimary: '#ffffffff',
        textOnSecondary: '#ffffffff',
        textOnTertiary: '#333333ff',
        textDisabled: '#999999ff',
        textPrimaryDefault: '#0f6148ff',
        textPrimaryPressed: '#0a4231ff',
        textAlertRed: '#ac3939ff',
        textAlertYellow: '#c28c00ff',
        textAlertBlue: '#00597fff',
        iconDefault: '#171717ff',
        iconSubdued: '#616161ff',
        iconOnPrimary: '#ffffffff',
        iconOnSecondary: '#ffffffff',
        iconOnTertiary: '#333333ff',
        iconDisabled: '#999999ff',
        iconPrimaryDefault: '#0f6148ff',
        iconPrimaryPressed: '#0a4231ff',
        iconAlertRed: '#ac3939ff',
        iconAlertYellow: '#c28c00ff',
        iconAlertBlue: '#00597fff',
        gradientNeutralBottomFadeSurfaceElevation1Start: '#FFFFFF33', // Don't use it, use elevation colors
        gradientNeutralBottomFadeSurfaceElevation1End: '#FFFFFF', // Don't use it, use elevation colors
        borderFocus: '#e2e2e2ff',
        borderDashed: '#cbcbcbff',
        borderInverse: '#ffffffff',
        borderSecondary: '#00854dff',
        borderAlertRed: '#cd4949ff',
        borderSubtleInverted: '#ffffff99',
        ...backgroundElevationColors.standard,
        ...borderElevationColors.standard,
        ...backgroundTertiaryElevationColors.standard,
        ...borderElevationColors.standard,
    },
    dark: {
        transparent: '#00000000',
        backgroundPrimaryDefault: '#61dbb7ff',
        backgroundPrimaryPressed: '#a7f1dbff',
        backgroundPrimarySubtleOnElevation0: '#0d211bff',
        backgroundPrimarySubtleOnElevation1: '#0e2f25ff',
        backgroundSecondaryDefault: '#2fbc81ff',
        backgroundSecondaryPressed: '#74dcb1ff',
        backgroundTertiaryPressedOnElevation0: '#1c1e1cff',
        backgroundTertiaryPressedOnElevation1: '#242524ff',
        backgroundNeutralBold: '#ffffffff',
        backgroundNeutralSubdued: '#373938ff',
        backgroundNeutralDisabled: '#242524ff',
        backgroundNeutralSubtleOnElevation0: '#161716ff',
        backgroundNeutralSubtleOnElevation1: '#1c1e1cff',
        backgroundAlertRedBold: '#ac3e3eff',
        backgroundAlertRedSubtleOnElevation0: '#220c0cff',
        backgroundAlertRedSubtleOnElevation1: '#2d1010ff',
        backgroundAlertYellowBold: '#cb9b20ff',
        backgroundAlertYellowSubtleOnElevation0: '#281e06ff',
        backgroundAlertYellowSubtleOnElevation1: '#352808ff',
        backgroundAlertBlueBold: '#1a6e92ff',
        backgroundAlertBlueSubtleOnElevation0: '#071d27ff',
        backgroundAlertBlueSubtleOnElevation1: '#092734ff',
        backGroundOnboardingCard: '#000000BD',
        textDefault: '#ffffffff',
        textDefaultInverse: '#000000ff',
        textSubdued: '#a2a4a3ff',
        textSecondaryHighlight: '#2fbc81ff',
        textOnPrimary: '#000000ff',
        textOnSecondary: '#000000ff',
        textOnTertiary: '#e1e1e1ff',
        textDisabled: '#6a6c6bff',
        textPrimaryDefault: '#61dbb7ff',
        textPrimaryPressed: '#a7f1dbff',
        textAlertRed: '#c66262ff',
        textAlertYellow: '#c29729ff',
        textAlertBlue: '#2290bfff',
        iconDefault: '#ffffffff',
        iconSubdued: '#a2a4a3ff',
        iconOnPrimary: '#000000ff',
        iconOnSecondary: '#000000ff',
        iconOnTertiary: '#e1e1e1ff',
        iconDisabled: '#6a6c6bff',
        iconPrimaryDefault: '#61dbb7ff',
        iconPrimaryPressed: '#a7f1dbff',
        iconAlertRed: '#c66262ff',
        iconAlertYellow: '#c29729ff',
        iconAlertBlue: '#2290bfff',
        gradientNeutralBottomFadeSurfaceElevation1Start: '#00000033', // Don't use it, use elevation colors
        gradientNeutralBottomFadeSurfaceElevation1End: '#000000', // Don't use it, use elevation colors
        borderFocus: '#242524ff',
        borderDashed: '#242524ff',
        borderInverse: '#ffffffff',
        borderSecondary: '#2fbc81ff',
        borderAlertRed: '#ac3e3eff',
        borderSubtleInverted: '#00000099',
        ...backgroundElevationColors.dark,
        ...borderElevationColors.dark,
        ...backgroundTertiaryElevationColors.dark,
        ...borderElevationColors.dark,
    },
} as const;

export type Color = keyof typeof colorVariants.standard;
export type Colors = Record<Color, CSSColor>;
export type ThemeColorVariant = keyof typeof colorVariants;
