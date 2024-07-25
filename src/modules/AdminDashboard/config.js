import React from 'react';
import moment from 'moment';

import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

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

export const DEFAULT_DATE_FORMAT = 'Do MMMM YYYY';

export const SYSTEM_ALERT_ACTION = {
    ASSIGN: 'ASSIGN',
    RESOLVE: 'RESOLVE',
};

export const REPORT_TYPE = {
    systemalertlog: 1,
    workshistory: 2,
    workiddupe: 3,
    scopusiddupe: 4,
    doidupe: 5,
};

export const isUrl = str => {
    try {
        const newUrl = new URL(str);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
};

export const optionDoubleRowRender = (props, option) => (
    <li
        {...props}
        style={{
            flexDirection: 'column',
            justifyContent: 'left',
            alignItems: 'flex-start',
            fontWeight: 400,
        }}
        data-testid={props.id}
    >
        <Typography variant="body1" color="textPrimary">
            {option.label}
        </Typography>
        <Typography variant="body1" color="textSecondary">
            {option.subtext}
        </Typography>
    </li>
);

export const getReportTypeFromValue = value => Object.entries(REPORT_TYPE).find(arr => arr[1] === value)?.[0];

export const getSystemAlertColumns = (locale, users) => {
    const alertStatus = locale.alertStatus;
    const alertStatusOption = Object.values(alertStatus);
    return [
        {
            field: 'sat_created_date',
            headerName: locale.columns.createdDate,
            width: 150,
            valueGetter: value => moment(value).format(DEFAULT_DATE_FORMAT),
        },
        { field: 'sat_title', headerName: locale.columns.topic, flex: 1 },
        {
            field: 'status',
            headerName: locale.columns.status,
            width: 160,
            valueGetter: (_, row) =>
                !!row.sat_assigned_to
                    ? users.find(user => user.id === row.sat_assigned_to)?.name ?? alertStatus.UNKNOWN
                    : alertStatus.UNASSIGNED,
            renderCell: params => (
                <Chip
                    data-testid={`alert-status-${params.id}`}
                    label={params.value}
                    variant="outlined"
                    size="small"
                    color={alertStatusOption.includes(params.value) ? 'default' : 'primary'}
                />
            ),
        },
    ];
};

export const getDisplayReportColumns = ({ locale, actionState, params }) => {
    const report = actionState?.displayReport?.value || getReportTypeFromValue(params.report_type);
    const txt = locale.columns[report];
    switch (report) {
        case 'workshistory':
            return [
                { field: 'pre_id', headerName: txt.id, order: 0 },
                { field: 'pre_pid', headerName: txt.pid, width: 150, order: 1 },
                {
                    field: 'pre_date',
                    headerName: txt.dateCreated,
                    width: 150,
                    valueGetter: value => moment(value, 'DD/MM/YYYY hh:mm').format(DEFAULT_DATE_FORMAT),
                    order: 2,
                },
                { field: 'rek_subtype', headerName: txt.workType, minWidth: 300, flex: 1, order: 3 },
                { field: 'usr_username', headerName: txt.user, width: 150, order: 4 },
                { field: 'pre_detail', headerName: txt.action, minWidth: 400, flex: 1, order: 5 },
            ].sort((a, b) => a.order > b.order);
        default:
            const systemIdParam = actionState?.systemAlertId || params?.record_id || '';
            return [
                { field: 'sat_id', headerName: txt.id, order: 0, exportOrder: 0 },
                {
                    field: 'sat_created_date',
                    headerName: txt.dateCreated,
                    width: 150,
                    valueGetter: value =>
                        (!!value && moment(value, 'YYYY-MM-DD hh:mm:ss').format(DEFAULT_DATE_FORMAT)) || '',
                    order: 1,
                    exportOrder: 1,
                },
                {
                    field: 'assigned_to_username',
                    headerName: 'Assigned username',
                    width: 150,
                    exportOrder: 2,
                    exportOnly: true,
                },
                {
                    field: 'assigned_to_full_name',
                    headerName: txt.assignedTo,
                    width: 150,
                    exportOrder: 3,
                    order: 2,
                },
                {
                    field: 'sat_assigned_date',
                    headerName: txt.assignedDate,
                    width: 150,
                    valueGetter: value =>
                        (!!value && moment(value, 'YYYY-MM-DD hh:mm:ss').format(DEFAULT_DATE_FORMAT)) || '',
                    order: 3,
                    exportOrder: 4,
                },
                {
                    field: 'resolved_by_username',
                    headerName: 'Resolved username',
                    width: 150,
                    exportOrder: 5,
                    exportOnly: true,
                },
                {
                    field: 'resolved_by_full_name',
                    headerName: txt.resolvedBy,
                    width: 150,
                    order: 4,
                    exportOrder: 6,
                },
                {
                    field: 'sat_resolved_date',
                    headerName: txt.resolvedDate,
                    width: 150,
                    valueGetter: value =>
                        (!!value && moment(value, 'YYYY-MM-DD hh:mm:ss').format(DEFAULT_DATE_FORMAT)) || '',
                    order: 5,
                    exportOrder: 7,
                },
                { field: 'sat_title', headerName: txt.title, minWidth: 400, flex: 1, order: 6, exportOrder: 8 },
                ...(systemIdParam !== ''
                    ? {
                          field: 'sat_content',
                          headerName: txt.content,
                          minWidth: 1000,
                          flex: 1,
                          order: 7,
                          exportOrder: 10,
                      }
                    : {}),
                {
                    field: 'sat_link',
                    headerName: txt.link,
                    minWidth: 400,
                    flex: 1,
                    renderCell: row =>
                        isUrl(row.value) ? (
                            <ExternalLink id={`link_${row.id}`} href={row.value} inline>
                                {row.value}
                            </ExternalLink>
                        ) : (
                            row.value
                        ),
                    order: 8,
                    exportOrder: 9,
                },
            ].filter(item => Object.keys(item).length > 0);
    }
};
