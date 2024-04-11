import React from 'react';
import locale from 'locale/components';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const AdminDashboard = () => {
    const txt = locale.components.adminDashboard;

    return (
        <StandardPage title={txt.title}>
            <StandardCard>Content here</StandardCard>
        </StandardPage>
    );
};

export default React.memo(AdminDashboard);
