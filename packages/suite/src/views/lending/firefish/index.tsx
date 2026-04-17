import { LendingFirefishWidget } from 'src/components/lending/LendingFirefishWidget';
import { PageHeader } from 'src/components/suite/layouts/SuiteLayout';
import { useLayout } from 'src/hooks/suite';

export const LendingFirefish = () => {
    useLayout('Lending', <PageHeader />);

    return <LendingFirefishWidget />;
};

export default LendingFirefish;
