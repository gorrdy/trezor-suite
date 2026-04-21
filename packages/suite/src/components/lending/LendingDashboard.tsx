import { Translation, type TranslationKey } from '@suite/intl';
import { goto } from '@suite/router';
import {
    Badge,
    Button,
    Card,
    Column,
    Grid,
    H3,
    Icon,
    type IconName,
    Paragraph,
    Row,
    Text,
} from '@trezor/components';

import { DashboardSection } from 'src/components/dashboard';
import { useDispatch } from 'src/hooks/suite';

type Provider = {
    id: string;
    name: string;
    icon: IconName;
    descriptionId: TranslationKey;
    highlights: TranslationKey[];
    isAvailable: boolean;
    website: string;
    onOpen?: () => unknown;
};

type LendingProviderCardProps = {
    provider: Provider;
};

const LendingProviderCard = ({ provider }: LendingProviderCardProps) => (
    <Card>
        <Column gap={16} alignItems="stretch">
            <Row gap={12} alignItems="center" justifyContent="space-between">
                <Row gap={12} alignItems="center">
                    <Icon name={provider.icon} size={28} />
                    <H3>{provider.name}</H3>
                </Row>
                {!provider.isAvailable && (
                    <Badge intent="neutral">
                        <Translation id="TR_LENDING_COMING_SOON" />
                    </Badge>
                )}
            </Row>
            <Paragraph typographyStyle="body-sm">
                <Translation id={provider.descriptionId} />
            </Paragraph>
            <Column gap={6}>
                {provider.highlights.map(highlight => (
                    <Row key={highlight} gap={8} alignItems="center">
                        <Icon name="check" size={16} intent="brand" />
                        <Text typographyStyle="body-sm">
                            <Translation id={highlight} />
                        </Text>
                    </Row>
                ))}
            </Column>
            <Row gap={8}>
                {provider.isAvailable ? (
                    <Button onClick={provider.onOpen} intent="brand" priority="primary">
                        <Translation id="TR_LENDING_OPEN_IN_SUITE" />
                    </Button>
                ) : (
                    <Button isDisabled intent="brand" priority="primary">
                        <Translation id="TR_LENDING_COMING_SOON" />
                    </Button>
                )}
                <Button
                    intent="neutral"
                    priority="secondary"
                    iconRight="arrowSquareOut"
                    onClick={() => window.open(provider.website, '_blank', 'noopener,noreferrer')}
                >
                    <Translation id="TR_LENDING_VISIT_WEBSITE" />
                </Button>
            </Row>
        </Column>
    </Card>
);

export const LendingDashboard = () => {
    const dispatch = useDispatch();

    const providers: Provider[] = [
        {
            id: 'firefish',
            name: 'Firefish',
            icon: 'fire',
            descriptionId: 'TR_LENDING_FIREFISH_DESCRIPTION',
            highlights: [
                'TR_LENDING_HIGHLIGHT_NON_CUSTODIAL',
                'TR_LENDING_HIGHLIGHT_NO_REHYPOTHECATION',
                'TR_LENDING_HIGHLIGHT_EUR_CZK',
            ],
            isAvailable: true,
            website: 'https://firefish.io',
            onOpen: () => dispatch(goto({ routeName: 'lending-firefish' })),
        },
        {
            id: 'ledn',
            name: 'Ledn',
            icon: 'bank',
            descriptionId: 'TR_LENDING_LEDN_DESCRIPTION',
            highlights: ['TR_LENDING_HIGHLIGHT_GLOBAL', 'TR_LENDING_HIGHLIGHT_PROOF_OF_RESERVES'],
            isAvailable: false,
            website: 'https://ledn.io',
        },
        {
            id: 'unchained',
            name: 'Unchained',
            icon: 'shieldCheck',
            descriptionId: 'TR_LENDING_UNCHAINED_DESCRIPTION',
            highlights: ['TR_LENDING_HIGHLIGHT_MULTISIG', 'TR_LENDING_HIGHLIGHT_US'],
            isAvailable: false,
            website: 'https://unchained.com',
        },
    ];

    return (
        <Column gap={32}>
            <DashboardSection
                heading={<Translation id="TR_LENDING_SECTION_TITLE" />}
                subheading={<Translation id="TR_LENDING_SECTION_SUBHEADING" />}
            >
                <Grid columns={2} gap={16}>
                    {providers.map(provider => (
                        <LendingProviderCard key={provider.id} provider={provider} />
                    ))}
                </Grid>
            </DashboardSection>
        </Column>
    );
};
