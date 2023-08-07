import React from 'react';
import { render } from 'test-utils';
import DashboardOrcidSyncMessage from './DashboardOrcidSyncMessage';

import { locale as pagesLocale } from 'locale';

const setup = (testProps = {}) => {
    const props = {
        locale: pagesLocale.pages.dashboard.header.dashboardOrcidSync.helpDrawer,
        ...testProps,
    };
    return render(<DashboardOrcidSyncMessage {...props} />);
};

describe('DashboardOrcidSyncMessage', () => {
    it('should render as expected', () => {
        const { container } = setup({
            StatusIcon: () => <div />,
            status: 'test1',
            lastSyncMessage: 'test2',
        });
        expect(container).toMatchSnapshot();
    });
});
