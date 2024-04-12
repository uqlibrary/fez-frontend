import React from 'react';

import Chip from '@mui/material/Chip';

import Today from './components/Today';
import SystemAlerts from './components/SystemAlerts';
import Reports from './components/Reports';

export const tabs = [
    { id: 0, title: 'TODAY', component: <Today /> },
    { id: 1, title: 'SYSTEM ALERTS', component: <SystemAlerts /> },
    { id: 2, title: 'REPORTS', component: <Reports /> },
];

export const tabProps = [
    { id: 1, render: count => ({ icon: <Chip color="error" label={count} size="small" />, iconPosition: 'end' }) },
];
