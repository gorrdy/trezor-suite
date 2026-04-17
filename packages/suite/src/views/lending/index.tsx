import { LendingDashboard } from 'src/components/lending/LendingDashboard';
import { PageHeader } from 'src/components/suite/layouts/SuiteLayout';
import { useLayout } from 'src/hooks/suite';

export const Lending = () => {
    useLayout('Lending', <PageHeader />);

    return <LendingDashboard />;
};

export default Lending;
