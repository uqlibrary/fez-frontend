import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import makeStyles from '@mui/styles/makeStyles';

import DatePicker from '@mui/lab/DatePicker';
import { GENERIC_DATE_FORMAT } from 'config/general';

const useStyles = makeStyles(
    theme => ({
        title: {
            ...theme.typography.caption,
        },
    }),
    { withTheme: true },
);

export const DateRangeField = ({
    id,
    locale,
    format,
    from: initialFrom,
    to: initialTo,
    onChange,
    disableFuture,
    disabled,
}) => {
    const [from, setFrom] = useState(initialFrom || null);
    const [to, setTo] = useState(initialTo || null);
    const [error, setError] = useState(undefined);
    const [fromError, setFromError] = useState(undefined);
    const [toError, setToError] = useState(undefined);
    const [allGood, setAllGood] = useState(false);
    const classes = useStyles();

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
                    <InputLabel shrink className={classes.title}>
                        {locale.title}
                    </InputLabel>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item zeroMinWidth style={{ flexGrow: 1, width: 1 }}>
                    <DatePicker
                        value={from}
                        onChange={handleFromDateChange}
                        error={!!error || !!fromError}
                        helperText={error || fromError}
                        autoOk
                        variant="inline"
                        disableToolbar
                        format={format}
                        id={`${id}-from-date`}
                        disableFuture={disableFuture}
                        disabled={disabled}
                    />
                </Grid>
                <Grid item xs="auto">
                    <TextField
                        variant="standard"
                        style={{ width: 24 }}
                        value=" to "
                        disabled
                        InputProps={{ disableUnderline: true }}
                    />
                </Grid>
                <Grid item zeroMinWidth style={{ flexGrow: 1, width: 1 }}>
                    <DatePicker
                        value={to}
                        onChange={handleToDateChange}
                        error={!!error || !!toError}
                        helperText={toError}
                        autoOk
                        variant="inline"
                        disableToolbar
                        format={format}
                        id={`${id}-to-date`}
                        disableFuture={disableFuture}
                        disabled={disabled}
                    />
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

DateRangeField.defaultProps = {
    disabled: false,
    format: GENERIC_DATE_FORMAT,
    disableFuture: false,
};

export default React.memo(DateRangeField);
