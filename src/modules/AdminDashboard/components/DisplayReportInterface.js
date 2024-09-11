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

import { DEFAULT_DATEPICKER_INPUT_FORMAT } from '../config';
import { isEmptyStr } from '../utils';
import { emptyReportActionState as emptyActionState, reportActionReducer as actionReducer } from '../reducers';

const DisplayReportInterface = ({ id, loading, disabled, exportDisabled, onReportClick, onExportClick }) => {
    const txt = locale.components.adminDashboard.tabs.reports;

    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const handleExportDisplayReportClick = React.useCallback(() => {
        onExportClick?.(actionState);
    }, [onExportClick, actionState]);

    const handleDisplayReportChange = changes => {
        console.log(changes);
        actionDispatch(changes);
    };

    const handleDisplayReportClick = () => {
        onReportClick?.(actionState);
    };

    const { isValid, fromDateError, toDateError, systemAlertError } = React.useMemo(() => {
        const locale = txt.error;
        const report = actionState.report?.value;
        const systemAlertId = actionState.filters.systemAlertId;
        let fromDateError = '';
        let toDateError = '';
        let systemAlertError = '';
        let isValid = false;

        const isValidNumber = value => {
            const numValue = Number(value);
            return isEmptyStr(`${value}`) || (Number.isFinite(numValue) && numValue > 0 && !`${value}`.includes('.'));
        };

        if (!!report) {
            fromDateError = '';
            toDateError = '';
            systemAlertError = '';

            if (report === 'systemalertlog') {
                const validSystemId = isValidNumber(systemAlertId);
                if (!!!actionState.filters.date_from && !!!actionState.filters.date_to && validSystemId) return true;
                else if (!validSystemId) {
                    systemAlertError = locale.systemAlertId;
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
                } else isValid = true;
            }
        }

        return { isValid, fromDateError, toDateError, systemAlertError };
    }, [txt.error, actionState]);

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
                            inputProps={{
                                id: `${id}-date-from-input`,
                                'data-testid': `${id}-date-from-input`,
                                label: txt.label.dateFrom,
                                'aria-label': txt.label.dateFrom,
                                'aria-labelledby': `${id}-input`,
                                'data-analyticsid': `${id}-date-from-input`,
                            }}
                            label={txt.label.dateFrom}
                            value={actionState.filters.date_from}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    error={!!fromDateError}
                                    required={!!fromDateError || actionState.report?.value === 'workshistory'}
                                    helperText={fromDateError}
                                />
                            )}
                            // eslint-disable-next-line react/prop-types
                            onChange={props =>
                                handleDisplayReportChange({
                                    type: 'fromDate',
                                    value: !!props ? moment(props).format() : null,
                                })
                            }
                            defaultValue=""
                            disableFuture
                            maxDate={actionState.filters.date_to}
                            disabled={
                                !!!actionState.report ||
                                (actionState.report?.value === 'systemalertlog' &&
                                    actionState.filters.systemAlertId !== '')
                            }
                            inputFormat={DEFAULT_DATEPICKER_INPUT_FORMAT}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box data-testid={`${id}-date-to`}>
                        <DatePicker
                            inputProps={{
                                id: `${id}-date-to-input`,
                                'data-testid': `${id}-date-to-input`,
                                label: txt.label.dateTo,
                                'aria-label': txt.label.dateTo,
                                'aria-labelledby': `${id}-date-to-label`,
                                'data-analyticsid': `${id}-date-to-input`,
                            }}
                            label={txt.label.dateTo}
                            value={actionState.filters.date_to}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    error={!!toDateError}
                                    required={
                                        !!actionState.filters.date_from || actionState.report?.value === 'workshistory'
                                    }
                                    helperText={toDateError}
                                />
                            )}
                            // eslint-disable-next-line react/prop-types
                            onChange={props =>
                                handleDisplayReportChange({
                                    type: 'toDate',
                                    value: !!props ? moment(props).format() : null,
                                })
                            }
                            defaultValue=""
                            disableFuture
                            minDate={actionState.filters.date_from}
                            disabled={
                                !!!actionState.report ||
                                (actionState.report?.value === 'systemalertlog' &&
                                    actionState.filters.systemAlertId !== '')
                            }
                            inputFormat={DEFAULT_DATEPICKER_INPUT_FORMAT}
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
                                    handleDisplayReportChange({ type: 'systemAlertId', value: props.target.value })
                                }
                                value={actionState.filters.systemAlertId}
                                helperText={systemAlertError}
                                error={!!systemAlertError}
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
