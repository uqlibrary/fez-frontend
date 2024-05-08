import React from 'react';

import Chip from '@mui/material/Chip';

import Today from './tabs/Today';
import SystemAlerts from './tabs/SystemAlerts';
import Reports from './tabs/Reports';

export const tabs = [
    { id: 0, title: 'TODAY', component: <Today /> },
    { id: 1, title: 'SYSTEM ALERTS', component: <SystemAlerts /> },
    { id: 2, title: 'REPORTS', component: <Reports /> },
];

export const tabProps = [
    {
        id: 1,
        render: count => {
            return count ? { icon: <Chip color="error" label={count} size="small" />, iconPosition: 'end' } : {};
        },
    },
];

export const COLOURS = { assigned: '#338CFA', unassigned: '#B60DCE' };

export const LINK_UNPROCESSED_WORKS =
    'https://espace.library.uq.edu.au/records/search?page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D%5Bvalue%5D=ismemberof%3A+UQ%3A218198&searchQueryParams%5Ball%5D%5Blabel%5D=&searchMode=advanced';

export const INTERNAL_LINK_DOMAIN = 'espace.library.uq.edu.au';

export const animationTemplate = (i, duration, delay) =>
    `animateFadeIn ${duration}ms ease-out ${delay * (i + 1)}ms forwards`;

export const MENUACTIONS = {
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    UP: 'MOVEUP',
    TOP: 'MOVETOP',
    DOWN: 'MOVEDOWN',
    BOTTOM: 'MOVEBOTTOM',
};

export const VIEWMODES = {
    VIEW: 'VIEW',
    ADD: 'ADD',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
};
export const VIEWADMINPANELMODES = [VIEWMODES.ADD, VIEWMODES.EDIT, VIEWMODES.DELETE];
export const REORDERING = [MENUACTIONS.TOP, MENUACTIONS.UP, MENUACTIONS.BOTTOM, MENUACTIONS.DOWN];
