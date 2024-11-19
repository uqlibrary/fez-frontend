import React from 'react';
import moment from 'moment';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { isEmptyStr } from './utils';

export const COLOURS = { assigned: '#338CFA', unassigned: '#B60DCE' };

export const LINK_UNPROCESSED_WORKS =
    'https://espace.library.uq.edu.au/records/search?page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D%5Bvalue%5D=ismemberof%3A+UQ%3A218198&searchQueryParams%5Ball%5D%5Blabel%5D=&searchMode=advanced';

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

export const DEFAULT_DATEPICKER_INPUT_FORMAT = 'DD/MM/YYYY';
export const DEFAULT_DATEPICKER_INPUT_FORMAT_WITH_TIME = 'DD/MM/YYYY HH:mm:ss';
export const DEFAULT_DATE_FORMAT = 'Do MMMM YYYY';
export const DEFAULT_DATE_FORMAT_WITH_TIME = 'Do MMMM YYYY hh:mm';
export const DEFAULT_SERVER_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_SERVER_DATE_FORMAT_NO_TIME = 'YYYY-MM-DD';
export const DEFAULT_DATE_FORMAT_WITH_TIME_24H = 'Do MMMM YYYY HH:mm';
export const DEFAULT_DATE_FORMAT_WITH_TIME_24H_SECONDS = 'Do MMMM YYYY HH:mm:ss';

export const SYSTEM_ALERT_ACTION = {
    ASSIGN: 'ASSIGN',
    RESOLVE: 'RESOLVE',
};

export const REPORT_TYPE = {
    systemalertlog: 1,
    workshistory: 2,
};

export const DEFAULT_SORTING = {
    alerts: [{ field: 'sat_created_date', sort: 'asc' }],
    systemalertlog: [{ field: 'sat_created_date', sort: 'asc' }],
    workshistory: [{ field: 'pre_date', sort: 'asc' }],
};

export const EXPORT_REPORT_JOBS = {
    ExportReportEmailSqlQueryJob: { queued: true },
};

export const maxDefaultDateRange = 52;
export const defaultDateRangeUnit = 'weeks'; // must match expected date units e.g. Moment.js https://momentjs.com/docs/#/manipulating/subtract/

export const isUrl = str => {
    try {
        const newUrl = new URL(str);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
};

export const defaultLegacyReportOption = { sel_id: 0, sel_title: '', sel_description: '' };

export const optionDoubleRowRender = (props, option) => {
    const hasBindings = option.sel_bindings?.length > 0 || false;
    return (
        <Box
            component={'li'}
            {...props}
            sx={{
                flexDirection: 'column',
                justifyContent: 'left',
                fontWeight: 400,
                '&:not(:last-of-type)': {
                    borderBottom: '1px solid #ccc',
                },
            }}
            style={{
                alignItems: 'flex-start',
            }}
            data-testid={props.id}
        >
            <Typography component={'div'} variant="body1" color="textPrimary" fontWeight={500}>
                {option.sel_title}{' '}
                {hasBindings && (
                    <Stack direction="row" spacing={1}>
                        <Typography variant="body2" color="textPrimary" fontWeight={500}>
                            Requires:{' '}
                        </Typography>
                        {option.sel_bindings.map((binding, index) => (
                            <Chip
                                key={`${binding}-${index}`}
                                variant="outlined"
                                color="primary"
                                label={binding.replace(':', '').replace('_', ' ')}
                                size="small"
                            />
                        ))}
                    </Stack>
                )}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                {option.sel_description}
            </Typography>
        </Box>
    );
};

export const getReportTypeFromValue = value => Object.entries(REPORT_TYPE).find(arr => arr[1] === value)?.[0];
export const getDefaultSorting = reportType => DEFAULT_SORTING?.[reportType] || [];

export const getFormattedServerDate = (dateStr, format = DEFAULT_DATE_FORMAT) =>
    (dateStr && moment(dateStr, DEFAULT_SERVER_DATE_FORMAT).format(format)) || '';

export const getSystemAlertColumns = (locale, users) => {
    const alertStatus = locale.alertStatus;
    const alertStatusOption = Object.values(alertStatus);
    return [
        {
            field: 'sat_created_date',
            headerName: locale.columns.createdDate,
            width: 200,
            type: 'date',
            valueGetter: value => moment(value, DEFAULT_SERVER_DATE_FORMAT).toDate(),
            valueFormatter: value => moment(value).format(DEFAULT_DATE_FORMAT_WITH_TIME_24H),
        },
        { field: 'sat_title', headerName: locale.columns.topic, flex: 1 },
        {
            field: 'status',
            headerName: locale.columns.status,
            width: 160,
            valueGetter: (_, row) =>
                !!row.sat_assigned_to
                    ? users.find(user => user.id === row.sat_assigned_to)?.preferred_name ?? alertStatus.UNKNOWN
                    : alertStatus.UNASSIGNED,
            renderCell: params => (
                <Chip
                    data-testid={`alert-status-${params.id}`}
                    label={params.value}
                    variant="filled"
                    size="small"
                    color={alertStatusOption.includes(params.value) ? 'default' : 'primary'}
                />
            ),
        },
    ];
};

export const getDisplayReportColumns = ({ locale, actionState, params }) => {
    const report = actionState?.report?.value || getReportTypeFromValue(params.report_type);

    const txt = locale.columns[report];
    switch (report) {
        case 'workshistory':
            return [
                { field: 'pre_id', headerName: txt.id, width: 150, exportOnly: true, exportOrder: 0 },
                { field: 'pre_pid', headerName: txt.pid, width: 150, order: 0, exportOrder: 1 },
                {
                    field: 'pre_date',
                    headerName: txt.dateCreated,
                    width: 150,
                    type: 'date',
                    valueGetter: value => (!!value && moment(value, DEFAULT_SERVER_DATE_FORMAT).toDate()) || null,
                    valueFormatter: value => {
                        if (value === null || value === '') return '';
                        return moment(value).format(DEFAULT_DATE_FORMAT);
                    },
                    order: 1,
                    exportOrder: 5,
                },
                {
                    field: 'rek_date',
                    headerName: txt.pubDate,
                    width: 150,
                    type: 'date',
                    valueGetter: value =>
                        (!!value && moment(value, DEFAULT_SERVER_DATE_FORMAT).format(DEFAULT_DATE_FORMAT)) || '',
                    exportOnly: true,
                    exportOrder: 4,
                },
                { field: 'rek_genre', headerName: txt.genre, minWidth: 300, flex: 1, order: 2, exportOrder: 2 },
                { field: 'rek_subtype', headerName: txt.subtype, minWidth: 300, flex: 1, order: 3, exportOrder: 3 },
                { field: 'usr_username', headerName: txt.user, width: 150, order: 4, exportOrder: 6 },
                { field: 'pre_detail', headerName: txt.action, minWidth: 600, flex: 1, order: 5, exportOrder: 7 },
            ];
        default:
            const systemIdParam = actionState?.filters.record_id || params?.record_id || '';
            const cols = [
                { field: 'sat_id', headerName: txt.id, order: 0, exportOrder: 0 },
                {
                    field: 'sat_created_date',
                    headerName: txt.dateCreated,
                    width: 150,
                    type: 'date',
                    valueGetter: value => (!!value && moment(value, DEFAULT_SERVER_DATE_FORMAT).toDate()) || null,
                    valueFormatter: value => {
                        if (value === null || value === '') return '';
                        return moment(value).format(DEFAULT_DATE_FORMAT);
                    },
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
                    type: 'date',
                    valueGetter: value => (!!value && moment(value, DEFAULT_SERVER_DATE_FORMAT).toDate()) || null,
                    valueFormatter: value => {
                        if (value === null || value === '') return '';
                        return moment(value).format(DEFAULT_DATE_FORMAT);
                    },
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
                    type: 'date',
                    valueGetter: value => (!!value && moment(value, DEFAULT_SERVER_DATE_FORMAT).toDate()) || null,
                    valueFormatter: value => {
                        if (value === null || value === '') return '';
                        return moment(value).format(DEFAULT_DATE_FORMAT);
                    },
                    order: 5,
                    exportOrder: 7,
                },
                { field: 'sat_title', headerName: txt.title, minWidth: 400, flex: 1, order: 6, exportOrder: 8 },
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
            ];

            if (systemIdParam !== '') {
                cols.push({
                    field: 'sat_content',
                    headerName: txt.content,
                    minWidth: 1000,
                    flex: 1,
                    order: 7,
                    exportOrder: 10,
                });
            }
            return cols;
    }
};

export const exportReportFilters = {
    date_from: {
        component: ({ state, id, errorMessage, onChange, locale }) => {
            const hasOwnBinding = !!state.report?.sel_bindings?.includes(':date_from');
            const hasDependantBinding = !!state.report?.sel_bindings?.includes(':date_to');
            return (
                <Grid item xs={12} sm={4} key={`${id}-date-from`}>
                    <Box data-testid={`${id}-date-from`}>
                        <DatePicker
                            inputProps={{
                                id: `${id}-date-from-input`,
                                'data-testid': `${id}-date-from-input`,
                                label: locale.label.dateFrom,
                                'aria-label': locale.label.dateFrom,
                                'aria-labelledby': `${id}-input`,
                                'data-analyticsid': `${id}-date-from-input`,
                            }}
                            label={locale.label.dateFrom}
                            value={state.filters.date_from}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    error={!!errorMessage?.date_from}
                                    required={hasOwnBinding}
                                    helperText={errorMessage?.date_from}
                                />
                            )}
                            onChange={props => {
                                onChange?.({
                                    type: 'fromDate',
                                    value: !!props
                                        ? moment(props)
                                              .startOf('day')
                                              .format(DEFAULT_SERVER_DATE_FORMAT)
                                        : null,
                                });
                                if (!hasDependantBinding) {
                                    onChange?.({
                                        type: 'toDate',
                                        value: !!props
                                            ? moment
                                                  .min([
                                                      moment(),
                                                      moment(props)
                                                          .endOf('day')
                                                          .add(
                                                              state.report.sel_maxDateRange ?? maxDefaultDateRange,
                                                              defaultDateRangeUnit,
                                                          ),
                                                  ])
                                                  .format(DEFAULT_SERVER_DATE_FORMAT)
                                            : null,
                                    });
                                }
                            }}
                            defaultValue=""
                            disableFuture
                            disabled={!!!state.report || !hasOwnBinding}
                            inputFormat={DEFAULT_DATEPICKER_INPUT_FORMAT}
                        />
                    </Box>
                </Grid>
            );
        },
        validator: ({ state, locale }) => {
            if (!state.report?.sel_bindings?.includes(':date_from')) return {};
            if (isEmptyStr(state.filters.date_from)) return { date_from: locale.required };

            const mFrom = moment(state.filters.date_from);
            if (!mFrom.isValid()) return { date_from: locale.invalidDate };

            // other field dependencies
            if (!state.report?.sel_bindings?.includes(':date_to')) return {};
            const mTo = moment(state.filters.date_to);
            if (!mFrom.isSameOrBefore(mTo)) return { date_from: locale.dateNotAfter };
            const maxRange = state.report.sel_maxDateRange ?? maxDefaultDateRange;
            let maxRangeDays = maxRange;
            switch (defaultDateRangeUnit) {
                case 'weeks':
                    maxRangeDays *= 7;
                    break;
                case 'months':
                    maxRangeDays *= 31;
                    break;
                case 'years':
                    maxRangeDays *= 365;
                    break;
                default:
                    break;
            }
            // compare by days for better accuracy
            if (mTo.diff(mFrom, 'days') > maxRangeDays) {
                return {
                    date_to: `Must be within ${maxRange} ${
                        maxRange > 1 ? defaultDateRangeUnit : defaultDateRangeUnit.slice(0, -1)
                    } of 'from' date`,
                };
            }
            return {};
        },
    },
    date_to: {
        component: ({ state, id, errorMessage, onChange, locale }) => {
            const hasBinding = !!state.report?.sel_bindings?.includes(':date_to');
            const exportReport = state.report || defaultLegacyReportOption;
            return (
                <Grid item xs={12} sm={4} key={`${id}-date-to`}>
                    <Box data-testid={`${id}-date-to`}>
                        <DatePicker
                            inputProps={{
                                id: `${id}-date-to-input`,
                                'data-testid': `${id}-date-to-input`,
                                label: locale.label.dateTo,
                                'aria-label': locale.label.dateTo,
                                'aria-labelledby': `${id}-date-to-label`,
                                'data-analyticsid': `${id}-date-to-input`,
                            }}
                            label={locale.label.dateTo}
                            value={state.filters.date_to}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    error={!!errorMessage?.date_to}
                                    required={hasBinding}
                                    helperText={errorMessage?.date_to}
                                />
                            )}
                            onChange={props =>
                                onChange?.({
                                    type: 'toDate',
                                    value: !!props
                                        ? moment(props)
                                              .endOf('day')
                                              .format(DEFAULT_SERVER_DATE_FORMAT)
                                        : null,
                                })
                            }
                            defaultValue=""
                            disableFuture
                            minDate={state.filters.date_from}
                            maxDate={moment(state.filters.date_from ?? new Date()).add(
                                exportReport.sel_maxDateRange ?? maxDefaultDateRange,
                                defaultDateRangeUnit,
                            )}
                            disabled={!!!state.report || !hasBinding}
                            inputFormat={DEFAULT_DATEPICKER_INPUT_FORMAT}
                        />
                    </Box>
                </Grid>
            );
        },
        validator: ({ state, locale }) => {
            if (!state.report?.sel_bindings?.includes(':date_to')) return {};
            if (isEmptyStr(state.filters.date_to)) return { date_to: locale.required };

            const mTo = moment(state.filters.date_to);
            if (!mTo.isValid()) return { date_to: locale.invalidDate };

            // other field dependencies
            if (!state.report?.sel_bindings?.includes(':date_from')) return {};
            const mFrom = moment(state.filters.date_from);
            if (!mTo.isSameOrAfter(mFrom)) return { date_to: locale.dateNotBefore };
            return {};
        },
    },
};
