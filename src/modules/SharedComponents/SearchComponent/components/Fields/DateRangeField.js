import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { GENERIC_DATE_FORMAT } from 'config/general';

export const DateRangeField = ({
    id,
    locale = {},
    format = GENERIC_DATE_FORMAT,
    from: initialFrom,
    to: initialTo,
    onChange,
    disableFuture = false,
    disabled = false,
}) => {
    const [from, setFrom] = useState(initialFrom || null);
    const [to, setTo] = useState(initialTo || null);
    const [error, setError] = useState(undefined);
    const [fromError, setFromError] = useState(undefined);
    const [toError, setToError] = useState(undefined);
    const [allGood, setAllGood] = useState(false);

    useEffect(() => {
        if (!!from && !from.isValid()) {
            setFromError('Please provide valid date');
        } else if (!!to && !to.isValid()) {
            setToError('Please provide valid date');
        } else if (!!from && !!to && from.isAfter(to)) {
            setError('Please provide valid date range');
        } else {
            setFromError(undefined);
            setToError(undefined);
            setError(undefined);
        }
        setAllGood(true);
    }, [from, to]);

    useEffect(() => {
        if (allGood && !error && !!from && !!to) {
            onChange({ from, to });
            setAllGood(false);
        }
    }, [allGood, error, from, fromError, onChange, to, toError]);

    const handleFromDateChange = useCallback(value => {
        setFrom(value);
    }, []);

    const handleToDateChange = useCallback(value => {
        setTo(value);
    }, []);

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <InputLabel shrink sx={theme => ({ ...theme.typography.caption })}>
                        {locale.title}
                    </InputLabel>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item zeroMinWidth sx={{ flexGrow: 1, width: '1px' }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            value={from && moment(from)}
                            onChange={handleFromDateChange}
                            disableToolbar
                            format={format}
                            disableFuture={disableFuture}
                            disabled={disabled}
                            slotProps={{
                                textField: {
                                    inputProps: { 'data-testid': `${id}-from-date` },
                                    id: `${id}-from-date`,
                                    error: !!error || !!fromError,
                                    helperText: error || fromError,
                                    variant: 'standard',
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs="auto">
                    <TextField
                        variant="standard"
                        sx={{ width: '24px' }}
                        value=" to "
                        disabled
                        InputProps={{ disableUnderline: true }}
                    />
                </Grid>
                <Grid item zeroMinWidth sx={{ flexGrow: 1, width: '1px' }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            value={to && moment(to)}
                            onChange={handleToDateChange}
                            disableToolbar
                            format={format}
                            disableFuture={disableFuture}
                            disabled={disabled}
                            slotProps={{
                                textField: {
                                    inputProps: { 'data-testid': `${id}-to-date` },
                                    id: `${id}-to-date`,
                                    error: !!error || !!toError,
                                    helperText: toError,
                                    variant: 'standard',
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

DateRangeField.propTypes = {
    id: PropTypes.string,
    locale: PropTypes.object,
    format: PropTypes.string,
    from: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    onChange: PropTypes.func.isRequired,
    disableFuture: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default React.memo(DateRangeField);
