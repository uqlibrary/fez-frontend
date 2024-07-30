import React from 'react';
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

import { useValidateReport } from '../hooks';

const DisplayReportInterface = ({
    id,
    loading,
    disabled,
    exportDisabled,
    state,
    onReportClick,
    onExportClick,
    onChange,
}) => {
    const txt = locale.components.adminDashboard.tabs.reports;

    const { isValid, fromDateError, toDateError, systemAlertError } = useValidateReport({
        locale: txt.error,
        displayReport: state.displayReport?.value,
        fromDate: state.fromDate,
        toDate: state.toDate,
        systemAlertId: state.systemAlertId,
    });

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
                        value={state.displayReport}
                        onChange={(_, value) => {
                            onChange({ type: 'displayReport', value });
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
                            value={state.fromDate}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    error={!!fromDateError}
                                    required={!!fromDateError || state.displayReport?.value === 'workshistory'}
                                    helperText={fromDateError}
                                />
                            )}
                            // eslint-disable-next-line react/prop-types
                            onChange={props =>
                                onChange({
                                    type: 'fromDate',
                                    value: !!props ? moment(props).format() : null,
                                })
                            }
                            defaultValue=""
                            disableFuture
                            maxDate={state.toDate}
                            disabled={
                                !!!state.displayReport ||
                                (state.displayReport?.value === 'systemalertlog' && state.systemAlertId !== '')
                            }
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
                            value={state.toDate}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    error={!!toDateError}
                                    required={!!state.fromDate || state.displayReport?.value === 'workshistory'}
                                    helperText={toDateError}
                                />
                            )}
                            // eslint-disable-next-line react/prop-types
                            onChange={props =>
                                onChange({
                                    type: 'toDate',
                                    value: !!props ? moment(props).format() : null,
                                })
                            }
                            defaultValue=""
                            disableFuture
                            minDate={state.fromDate}
                            disabled={
                                !!!state.displayReport ||
                                (state.displayReport?.value === 'systemalertlog' && state.systemAlertId !== '')
                            }
                        />
                    </Box>
                </Grid>
                {state.displayReport?.value === 'systemalertlog' && (
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
                                    onChange({ type: 'systemAlertId', value: props.target.value })
                                }
                                value={state.systemAlertId}
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
                        onClick={onReportClick}
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
                        onClick={onExportClick}
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
    state: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    exportDisabled: PropTypes.bool,
    onReportClick: PropTypes.func,
    onExportClick: PropTypes.func,
    onChange: PropTypes.func,
};

export default React.memo(DisplayReportInterface);
