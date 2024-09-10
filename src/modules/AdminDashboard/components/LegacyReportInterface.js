import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import locale from 'locale/components';

import { emptyReportActionState as emptyActionState, reportActionReducer as actionReducer } from '../reducers';
import { DEFAULT_DATEPICKER_INPUT_FORMAT, optionDoubleRowRender, defaultLegacyReportOption } from '../config';

const filters = {
    date_from: {
        component: ({ state, id, errorMessage, onChange }) => {
            const txt = locale.components.adminDashboard.tabs.reports;
            const hasBinding = state.exportReport?.sel_bindings?.includes('date_from');
            return (
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
                            value={state.fromDate}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    error={!!errorMessage}
                                    required={hasBinding}
                                    helperText={errorMessage}
                                />
                            )}
                            // eslint-disable-next-line react/prop-types
                            onChange={props =>
                                onChange?.({
                                    type: 'fromDate',
                                    value: !!props ? moment(props).format() : null,
                                })
                            }
                            defaultValue=""
                            disableFuture
                            maxDate={state.toDate}
                            disabled={!!!state.exportReport || !hasBinding}
                            inputFormat={DEFAULT_DATEPICKER_INPUT_FORMAT}
                        />
                    </Box>
                </Grid>
            );
        },
        validator: state => {
            return moment(state.fromDate).isValid();
        },
    },
    date_to: {
        component: ({ state, id, errorMessage, onChange }) => {
            const txt = locale.components.adminDashboard.tabs.reports;
            const hasBinding = state.exportReport?.sel_bindings?.includes('date_to');
            return (
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
                            value={state.toDate}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    error={!!errorMessage}
                                    required={hasBinding}
                                    helperText={errorMessage}
                                />
                            )}
                            // eslint-disable-next-line react/prop-types
                            onChange={props =>
                                onChange?.({
                                    type: 'toDate',
                                    value: !!props ? moment(props).format() : null,
                                })
                            }
                            defaultValue=""
                            disableFuture
                            minDate={state.fromDate}
                            disabled={!!!state.exportReport || !hasBinding}
                            inputFormat={DEFAULT_DATEPICKER_INPUT_FORMAT}
                        />
                    </Box>
                </Grid>
            );
        },
        validator: state => {
            return !!state;
        },
    },
};

const LegacyReportInterface = ({ id, loading, disabled, items, onExportClick }) => {
    const txt = locale.components.adminDashboard.tabs.reports;

    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const exportReport = actionState.exportReport || defaultLegacyReportOption;

    const { isValid, fromDateError, toDateError } = React.useMemo(() => {
        const locale = txt.error;

        const exportReport = actionState.exportReport;
        const fromDate = actionState.fromDate;
        const toDate = actionState.toDate;
        let fromDateError = '';
        let toDateError = '';
        let isValid = false;

        if (!!exportReport) {
            if (!!exportReport.sel_bindings) {
                fromDateError = '';
                toDateError = '';

                const mFrom = moment(fromDate);
                const mTo = moment(toDate);

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
            } else isValid = true;
        }
        return { isValid, fromDateError, toDateError };
    }, [txt.error, actionState]);

    const isDisabled = !isValid || disabled;

    const handleFilterChange = React.useCallback(value => {
        console.log(value);
        actionDispatch(value);
    }, []);

    const handleExportReportChange = React.useCallback((_, value) => {
        actionDispatch({ type: 'exportReport', value });
    }, []);

    const handleExportReport = React.useCallback(() => {
        onExportClick(exportReport.sel_id);
    }, [onExportClick, exportReport?.sel_id]);

    return (
        <Box id={id} data-testid={id}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        id={id}
                        disablePortal
                        options={items}
                        isOptionEqualToValue={(option, value) => option.sel_id === value.sel_id}
                        getOptionKey={option => option.sel_id}
                        getOptionLabel={option => option.sel_title}
                        renderOption={optionDoubleRowRender}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="standard"
                                label={txt.label.report}
                                helperText={txt.label.helperText}
                                inputProps={{
                                    ...params.inputProps,
                                    id: `${id}-input`,
                                    'data-analyticsid': `${id}-input`,
                                    'data-testid': `${id}-input`,
                                    'aria-describedby': `${id}-label`,
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
                        value={exportReport}
                        onChange={handleExportReportChange}
                        disabled={loading || disabled}
                    />
                </Grid>

                {Object.keys(filters).map(key =>
                    filters[key].component({
                        state: actionState,
                        id,
                        errorMessage: fromDateError || toDateError,
                        onChange: handleFilterChange,
                    }),
                )}

                <Grid item xs={12}>
                    <Button
                        id="report-export-button"
                        data-testid="report-export-button"
                        variant="contained"
                        onClick={handleExportReport}
                        disabled={isDisabled || loading}
                    >
                        {loading && (
                            <CircularProgress
                                color="inherit"
                                size={20}
                                id={'export-report-progress'}
                                data-testid={'export-report-progress'}
                                sx={{ mr: 1 }}
                            />
                        )}
                        {txt.label.exportReport}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

LegacyReportInterface.propTypes = {
    id: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    items: PropTypes.array,
    state: PropTypes.object.isRequired,
    exportReport: PropTypes.object,
    onChange: PropTypes.func,
    onExportClick: PropTypes.func,
};

export default React.memo(LegacyReportInterface);
