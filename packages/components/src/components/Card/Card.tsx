import { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';
import { borders, mapElevationToBoxShadow, spacings } from '@trezor/theme';
import { ElevationContext, useElevation } from '../ElevationContext/ElevationContext';
import { Elevation, mapElevationToBackground } from '@trezor/theme/src/elevation';

const Wrapper = styled.div<{ $elevation: Elevation; $paddingSize: number }>`
    display: flex;
    flex-direction: column;
    padding: ${({ $paddingSize }) => $paddingSize}px;
    background: ${({ theme, $elevation }) => theme[mapElevationToBackground[$elevation]]};
    border-radius: ${borders.radii.md};
    box-shadow: ${({ theme, $elevation }) => {
        if ($elevation === 1) {
            const boxShadow = mapElevationToBoxShadow[$elevation];

            return boxShadow !== undefined ? theme[boxShadow] : undefined;
        }

        return undefined;
    }};
    /* when theme changes from light to dark */
    transition: background 0.3s;
`;

const getPaddingSize = (paddingType?: PaddingType) => {
    switch (paddingType) {
        case 'none':
            return 0;
        case 'large':
            return spacings.lg;
        case 'normal':
        default:
            return spacings.sm;
    }
};

type PaddingType = 'none' | 'normal' | 'large';

export interface CardProps {
    paddingType?: PaddingType;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;

    children?: ReactNode;
    className?: string;

    forceElevation?: Elevation;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ paddingType = 'normal', children, forceElevation, ...rest }, ref) => {
        const { elevation } = useElevation();

        const adjustedElevation =
            // eslint-disable-next-line no-nested-ternary
            forceElevation !== undefined ? forceElevation : elevation !== null ? elevation : 0;

        return (
            <Wrapper
                ref={ref}
                $elevation={adjustedElevation}
                $paddingSize={getPaddingSize(paddingType)}
                {...rest}
            >
                <ElevationContext baseElevation={adjustedElevation}>{children}</ElevationContext>
            </Wrapper>
        );
    },
);
