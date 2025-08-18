import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import locale from 'locale/components';

import { DEFAULT_DATEPICKER_INPUT_FORMAT, DEFAULT_SERVER_DATE_FORMAT_NO_TIME } from '../config';
import { isEmptyStr } from '../utils';
import { emptyReportActionState as emptyActionState, reportActionReducer as actionReducer } from '../reducers';

export const validator = ({ locale, actionState }) => {
    const report = actionState.report?.value;
    const recordId = actionState.filters.record_id;
    let fromDateError = '';
    let toDateError = '';
    let reportIdError = '';
    let isValid = false;

    const isValidNumber = value => {
        const numValue = Number(value);
        return isEmptyStr(`${value}`) || (Number.isFinite(numValue) && numValue > 0 && !`${value}`.includes('.'));
    };

    if (!!report) {
        fromDateError = '';
        toDateError = '';
        reportIdError = '';

        if (report === 'systemalertlog') {
            const validSystemId = isValidNumber(recordId);

            if (!!!actionState.filters.date_from && !!!actionState.filters.date_to && validSystemId) {
                return { isValid: true, fromDateError, toDateError, reportIdError };
            } else if (!validSystemId) {
                reportIdError = locale.recordId;
                isValid = false;
            }
        }

        const mFrom = moment(actionState.filters.date_from);
        const mTo = moment(actionState.filters.date_to);

        if (report === 'workshistory' && !mFrom.isValid() && !mTo.isValid()) {
            fromDateError = locale.required;
            toDateError = locale.required;
            isValid = false;
        }

        if (mFrom.isValid() && !mTo.isValid()) {
            toDateError = locale.required;
            isValid = false;
        } else if (mTo.isValid() && !mFrom.isValid()) {
            fromDateError = locale.required;
            isValid = false;
        } else if (mFrom.isValid() && mTo.isValid()) {
            if (!mFrom.isSameOrBefore(mTo)) {
                fromDateError = locale.dateNotAfter;
                isValid = false;
            } else isValid = isEmptyStr(reportIdError);
        }
    }

    return { isValid, fromDateError, toDateError, reportIdError };
};

const DisplayReportInterface = ({ id, loading, disabled, exportDisabled, onReportClick, onExportClick }) => {
    const txt = locale.components.adminDashboard.tabs.reports;

    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });
    const handleExportDisplayReportClick = React.useCallback(() => {
        onExportClick?.(actionState);
    }, [onExportClick, actionState]);

    const handleDisplayReportChange = changes => {
        actionDispatch(changes);
    };

    const handleDisplayReportClick = () => {
        onReportClick?.(actionState);
    };

    const { isValid, fromDateError, toDateError, reportIdError } = React.useMemo(
        () => validator({ locale: txt.error, actionState }),
        [txt.error, actionState],
    );

    const isDisabled = !isValid || disabled;

    return (
        <Box id={id} data-testid={id}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        disablePortal
                        id={id}
                        fullWidth
                        variant="standard"
                        options={txt.options.display}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={txt.label.report}
                                variant="standard"
                                inputProps={{
                                    ...params.inputProps,
                                    id: `${id}-input`,
                                    'data-analyticsid': `${id}-input`,
                                    'data-testid': `${id}-input`,
                                }}
                                InputLabelProps={{
                                    'data-testid': `${id}-label`,
                                    htmlFor: `${id}-input`,
                                }}
                            />
                        )}
                        ListboxProps={{
                            id: `${id}-listbox`,
                            'data-analyticsid': `${id}-listbox`,
                            'data-testid': `${id}-listbox`,
                        }}
                        value={actionState.report}
                        onChange={(_, value) => {
                            handleDisplayReportChange({ type: 'displayReport', value });
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box data-testid={`${id}-date-from`}>
                        <DatePicker
                            label={txt.label.dateFrom}
                            value={actionState.filters.date_from && moment(actionState.filters.date_from)}
                            slotProps={{
                                textField: {
                                    inputProps: {
                                        id: `${id}-date-from-input`,
                                        'data-testid': `${id}-date-from-input`,
                                        label: txt.label.dateFrom,
                                        'aria-label': txt.label.dateFrom,
                                        'aria-labelledby': `${id}-input`,
                                        'data-analyticsid': `${id}-date-from-input`,
                                    },
                                    variant: 'standard',
                                    fullWidth: true,
                                    error: !!fromDateError,
                                    required: !!fromDateError || actionState.report?.value === 'workshistory',
                                    helperText: fromDateError,
                                },
                                field: {
                                    clearable: true, // Allow clearing the date
                                    readOnly: false,
                                },
                            }}
                            // eslint-disable-next-line react/prop-types
                            onChange={props =>
                                handleDisplayReportChange({
                                    type: 'fromDate',
                                    value: !!props ? moment(props).format(DEFAULT_SERVER_DATE_FORMAT_NO_TIME) : null,
                                })
                            }
                            disableFuture
                            maxDate={actionState.filters.date_to && moment(actionState.filters.date_to)}
                            disabled={
                                !!!actionState.report ||
                                (actionState.report?.value === 'systemalertlog' && actionState.filters.record_id !== '')
                            }
                            format={DEFAULT_DATEPICKER_INPUT_FORMAT}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box data-testid={`${id}-date-to`}>
                        <DatePicker
                            label={txt.label.dateTo}
                            value={actionState.filters.date_to && moment(actionState.filters.date_to)}
                            slotProps={{
                                textField: {
                                    inputProps: {
                                        id: `${id}-date-to-input`,
                                        'data-testid': `${id}-date-to-input`,
                                        label: txt.label.dateTo,
                                        'aria-label': txt.label.dateTo,
                                        'aria-labelledby': `${id}-date-to-label`,
                                        'data-analyticsid': `${id}-date-to-input`,
                                    },
                                    variant: 'standard',
                                    fullWidth: true,
                                    error: !!toDateError,
                                    required:
                                        !!actionState.filters.date_from || actionState.report?.value === 'workshistory',
                                    helperText: toDateError,
                                },
                                field: {
                                    clearable: true, // Allow clearing the date
                                    readOnly: false,
                                },
                            }}
                            // eslint-disable-next-line react/prop-types
                            onChange={props =>
                                handleDisplayReportChange({
                                    type: 'toDate',
                                    value: !!props ? moment(props).format(DEFAULT_SERVER_DATE_FORMAT_NO_TIME) : null,
                                })
                            }
                            disableFuture
                            minDate={actionState.filters.date_from && moment(actionState.filters.date_from)}
                            disabled={
                                !!!actionState.report ||
                                (actionState.report?.value === 'systemalertlog' && actionState.filters.record_id !== '')
                            }
                            format={DEFAULT_DATEPICKER_INPUT_FORMAT}
                        />
                    </Box>
                </Grid>
                {actionState.report?.value === 'systemalertlog' && (
                    <Grid item xs={12} sm={4}>
                        <Box data-testid={`${id}-system-alert-id`}>
                            <TextField
                                label={txt.label.systemId}
                                variant="standard"
                                fullWidth
                                inputProps={{
                                    id: `${id}-system-alert-id-input`,
                                    'data-analyticsid': `${id}-system-alert-id-input`,
                                    'data-testid': `${id}-system-alert-id-input`,
                                }}
                                InputLabelProps={{
                                    'data-testid': `${id}-system-alert-id-label`,
                                    htmlFor: `${id}-system-alert-id-input`,
                                }}
                                sx={{ mt: 1 }}
                                onChange={props =>
                                    // eslint-disable-next-line react/prop-types
                                    handleDisplayReportChange({ type: 'record_id', value: props.target.value })
                                }
                                value={actionState.filters.record_id}
                                helperText={reportIdError}
                                error={!!reportIdError}
                            />
                        </Box>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Button
                        id={`${id}-button`}
                        data-testid={`${id}-button`}
                        variant="contained"
                        disabled={isDisabled}
                        onClick={handleDisplayReportClick}
                    >
                        {loading && (
                            <CircularProgress
                                color="inherit"
                                size={20}
                                id={'display-report-progress'}
                                data-testid={'display-report-progress'}
                                sx={{ mr: 1 }}
                            />
                        )}
                        {txt.label.runReport}
                    </Button>
                    <Button
                        id={`${id}-export-button`}
                        data-testid={`${id}-export-button`}
                        variant="contained"
                        color="secondary"
                        sx={{ marginInlineStart: 1 }}
                        onClick={handleExportDisplayReportClick}
                        disabled={exportDisabled}
                    >
                        {txt.label.export}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

DisplayReportInterface.propTypes = {
    id: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    exportDisabled: PropTypes.bool,
    onReportClick: PropTypes.func,
    onExportClick: PropTypes.func,
};

export default React.memo(DisplayReportInterface);
