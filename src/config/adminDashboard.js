import React from 'react';
import { default as adminDashboardLocale } from 'locale/components';

import Chip from '@mui/material/Chip';

import Today from 'modules/AdminDashboard/tabs/Today';
import SystemAlerts from 'modules/AdminDashboard/tabs/SystemAlerts';
import Reports from 'modules/AdminDashboard/tabs/Reports';

export const tabConfig = [
    { id: 0, title: adminDashboardLocale.components.adminDashboard.tabs.today.tabLabel, component: Today },
    {
        id: 1,
        title: adminDashboardLocale.components.adminDashboard.tabs.systemalerts.tabLabel,
        component: SystemAlerts,
    },
    { id: 2, title: adminDashboardLocale.components.adminDashboard.tabs.reports.tabLabel, component: Reports },
];

export const tabProps = [
    {
        id: 1,
        render: data => {
            const count = data?.systemalerts?.mine;
            return count
                ? {
                      icon: <Chip color="error" label={count} size="small" data-testid={`tab-counter-${count}`} />,
                      iconPosition: 'end',
                  }
                : {};
        },
    },
];
