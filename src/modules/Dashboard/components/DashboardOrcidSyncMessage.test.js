import React from 'react';
import DashboardOrcidSyncMessage from './DashboardOrcidSyncMessage';

import { locale as pagesLocale } from 'locale';

const setup = (testProps = {}, args = {}) => {
    const props = {
        locale: pagesLocale.pages.dashboard.header.dashboardOrcidSync.helpDrawer,
        ...testProps,
    };
    return getElement(DashboardOrcidSyncMessage, props, args);
};

describe('DashboardOrcidSyncMessage', () => {
    it('should render as expected', () => {
        const wrapper = setup({
            StatusIcon: () => <div />,
            status: 'test1',
            lastSyncMessage: 'test2',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
