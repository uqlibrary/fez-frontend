import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import FormHelperText from '@mui/material/FormHelperText';
import { PLACEHOLDER_ISO8601_ZULU_DATE } from 'config/general';

import moment from 'moment';

export const STATUS_VALID = 1; // user entered a valid date
export const STATUS_INVALID = 2; // user entered an invalid date
export const STATUS_FUTURE_DATE = 3; // the date entered is valid but in the future, when prop disableFuture is

export const MONTH_UNSELECTED = -1;

const PartialDateForm = ({
    locale = {
        dayLabel: 'Day',
        monthLabel: 'Month',
        yearLabel: 'Year',
        validationMessage: {
            date: 'Invalid date',
            day: 'Invalid day',
            month: 'Enter a month',
            year: 'Invalid year',
            yearRequired: 'Year required',
            future: 'Date must be before now',
        },
        minNumberCharCode: 48,
        maxNumberCharCode: 57,
    },
    onChange,
    dateFormat = 'YYYY-MM-DD',
    allowPartial,
    disableFuture,
    disabled,
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    floatingTitle = 'Enter a date',
    required,
    hasError,
    input,
    meta,
    partialDateFormId,
    clearable,
    value,
}) => {
    const initDate = () => {
        const dateValue =
            // eslint-disable-next-line react/prop-types
            (value && moment(value)) ||
            (input && input.value && moment(input.value)) ||
            (meta && meta.initial && moment(meta.initial)) ||
            null;

        if (!!dateValue && dateValue.isValid() && !dateValue.isSame(PLACEHOLDER_ISO8601_ZULU_DATE)) {
            return {
                day: dateValue.date(),
                month: dateValue.month(),
                year: dateValue.year(),
            };
        } else {
            return {
                day: '',
                month: -1,
                year: '',
            };
        }
    };

    const [state, setState] = React.useState(initDate);
    const [error, setError] = React.useState();

    const _isUnselected = month => {
        return month === MONTH_UNSELECTED || month === null;
    };

    /**
     * validate the entered date field
     * @param state
     * @returns {int} returns one of STATUS_VALID, STATUS_INVALID, STATUS_FUTURE_DATE, defined above
     * @private
     */
    const _validate = state => {
        const { day: dayActual, month: monthActual, year } = state;
        // moment validation doesn't recognise -1 or empty string as a valid date
        const month = monthActual === MONTH_UNSELECTED ? null : monthActual;
        const day = isNaN(dayActual) || !dayActual ? null : dayActual;
        const hasRequired = !!year && (allowPartial || (!!day && month !== null));
        const momentDate = { ...state, month, day };
        const validationStatus = hasRequired && moment(momentDate).isValid() ? STATUS_VALID : STATUS_INVALID;

        if (validationStatus === STATUS_VALID && !!disableFuture) {
            if (!!allowPartial) {
                const yearNow = moment().year();
                if (year > yearNow) {
                    return STATUS_FUTURE_DATE;
                }
            } else {
                const dateNow = moment();
                if (!moment(momentDate).isSameOrBefore(dateNow)) {
                    return STATUS_FUTURE_DATE;
                }
            }
        }

        if (!allowPartial && !!clearable) {
            if (!year && !day && !month) {
                return STATUS_VALID;
            }
            if (
                !!year &&
                !!day &&
                month !== MONTH_UNSELECTED &&
                moment(momentDate).isValid() &&
                moment(momentDate).isSameOrBefore()
            ) {
                return STATUS_VALID;
            }
            if (!!year && !!day && month !== MONTH_UNSELECTED && !moment(momentDate).isValid()) {
                return STATUS_INVALID;
            }
            if (
                !!year &&
                !!day &&
                month !== MONTH_UNSELECTED &&
                moment(momentDate).isValid() &&
                moment(momentDate).isSameOrAfter()
            ) {
                return STATUS_INVALID;
            }
        }
        return validationStatus;
    };
    const _displayErrors = (state, validationStatus, allowPartial, isRequired = false) => {
        const { day, month, year } = state;
        const validMonthIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        let date = '';

        switch (validationStatus) {
            case STATUS_INVALID:
                date =
                    // initial load of 'required' message for required date fields
                    /* istanbul ignore next */
                    (allowPartial && isRequired && !year && !isNaN(year) && locale.validationMessage.yearRequired) ||
                    // initial load of 'required' message for required date fields
                    /* istanbul ignore next */
                    (isNaN(year) && locale.validationMessage.year) ||
                    // they've just typed in a nonsense number
                    // dont wait for date complete for the moment validation to kick in
                    ((isNaN(day) || (!!day && (day < 1 || day > 31))) && locale.validationMessage.day) ||
                    // // date fields initially blank // remove
                    // (year === null && _isUnselected(month) && day === null && '') || // remove
                    // they've entered a day
                    /* istanbul ignore next */
                    (year === null && _isUnselected(month) && !!day && '') ||
                    // they've entered a day and a month
                    /* istanbul ignore next */
                    (year === null && validMonthIndices.includes(month) && !!day && '') ||
                    // encourage them to select a month if the year and day are selected
                    /* istanbul ignore next */
                    (!!year && _isUnselected(month) && !!day && locale.validationMessage.month) ||
                    locale.validationMessage.date;
                break;
            case STATUS_VALID:
                // cypress does not like more concise format (?!?) (integration tests didnt either?!?!?)
                if (!!year && validMonthIndices.includes(month) && !!day) {
                    // date complete for non-partial-entry
                    date = '';
                } else if (allowPartial && !!year && _isUnselected(month) && !day) {
                    // partial entry means they can get away with just a year
                    date = '';
                } else if (!allowPartial && !!clearable && !year && !day && month === MONTH_UNSELECTED) {
                    date = '';
                } else {
                    date = locale.validationMessage.date;
                }
                break;
            case STATUS_FUTURE_DATE:
                date = locale.validationMessage.future;
                break;
            /* istanbul ignore next */
            default:
                /* istanbul ignore next */
                date = (!!year && isNaN(year) && locale.validationMessage.year) || '';
                break;
        }
        setError(date);
    };

    const _isNumber = event => {
        if (event.charCode < locale.minNumberCharCode || event.charCode > locale.maxNumberCharCode) {
            event.preventDefault();
        }
    };

    const validate = newState => {
        const validationStatus = _validate(newState);

        _displayErrors(newState, validationStatus, allowPartial, required);

        // moment validation doesn't recognise -1 as a valid date.
        const month = newState.month === MONTH_UNSELECTED ? null : newState.month;
        const day = isNaN(newState.day) || !newState.day ? null : newState.day;
        const momentDate = { ...state, month, day };
        const fullDate = validationStatus === STATUS_VALID ? moment(momentDate).format(dateFormat) : '';

        setState(newState);
        return fullDate;
    };
    const _onDateChanged = key => {
        return (event, index, value) => {
            let newDateField = '';
            if (event.target.value !== '') {
                newDateField = parseInt(
                    event.target.value === undefined ? /* istanbul ignore next */ value : event.target.value,
                    10,
                );
            }
            const newState = { ...state, [key]: newDateField };
            const fullDate = validate(newState);

            onChange?.(fullDate) || input?.onChange?.(fullDate);
        };
    };

    React.useEffect(() => {
        !!onChange && validate(state);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onChange]);

    const renderMonths = months.map((month, index) => (
        <MenuItem key={index} value={index}>
            {month}
        </MenuItem>
    ));
    const isError = error || hasError || '';

    return (
        <Grid container spacing={0} padding={0} id={partialDateFormId}>
            <Grid xs={12}>
                <InputLabel error={!!isError} shrink required={required}>
                    {floatingTitle}
                </InputLabel>
            </Grid>
            <Grid xs={12}>
                <Grid container spacing={2} padding={0} style={{ marginTop: -12 }} flexWrap={'nowrap'}>
                    <Grid xs>
                        <TextField
                            name="day"
                            variant="standard"
                            id={`${partialDateFormId}-day`}
                            type="text"
                            fullWidth
                            disabled={disabled}
                            error={!!isError}
                            onKeyPress={_isNumber}
                            onChange={_onDateChanged('day')}
                            onBlur={!allowPartial ? _onDateChanged('day') : undefined}
                            placeholder={locale.dayLabel}
                            inputProps={{
                                label: 'day',
                                maxLength: 2,
                                id: `${partialDateFormId}-day-input`,
                                'data-analyticsid': `${partialDateFormId}-day-input`,
                                'data-testid': `${partialDateFormId}-day-input`,
                            }}
                            value={state.day}
                        />
                        {isError && <FormHelperText error>{isError}</FormHelperText>}
                    </Grid>
                    <Grid xs>
                        <Select
                            name="month"
                            variant="standard"
                            id={`${partialDateFormId}-month`}
                            fullWidth
                            error={!!isError}
                            disabled={disabled}
                            value={state.month === null ? /* istanbul ignore next */ -1 : state.month}
                            placeholder={locale.monthLabel}
                            onChange={_onDateChanged('month')}
                            inputProps={{
                                label: 'month',
                                maxLength: 2,
                                'data-analyticsid': `${partialDateFormId}-month-input`,
                                'data-testid': `${partialDateFormId}-month-input`,
                                id: `${partialDateFormId}-month-input`,
                            }}
                            SelectDisplayProps={{
                                id: `${partialDateFormId}-month-select`,
                                'data-analyticsid': `${partialDateFormId}-month-select`,
                                'data-testid': `${partialDateFormId}-month-select`,
                            }}
                            MenuProps={{
                                id: `${partialDateFormId}-month-options`,
                                'data-analyticsid': `${partialDateFormId}-month-options`,
                                'data-testid': `${partialDateFormId}-month-options`,
                            }}
                        >
                            <MenuItem key={-1} value={MONTH_UNSELECTED}>
                                Month
                            </MenuItem>
                            {renderMonths}
                        </Select>
                    </Grid>
                    <Grid xs>
                        <TextField
                            name="year"
                            variant="standard"
                            id={`${partialDateFormId}-year`}
                            type="text"
                            fullWidth
                            disabled={disabled}
                            placeholder={locale.yearLabel}
                            error={!!isError}
                            onKeyPress={_isNumber}
                            onChange={_onDateChanged('year')}
                            onBlur={_onDateChanged('year')}
                            inputProps={{
                                label: 'year',
                                maxLength: 4,
                                id: `${partialDateFormId}-year-input`,
                                'data-analyticsid': `${partialDateFormId}-year-input`,
                                'data-testid': `${partialDateFormId}-year-input`,
                            }}
                            value={state.year}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

PartialDateForm.propTypes = {
    control: PropTypes.any,
    value: PropTypes.any,
    locale: PropTypes.object,
    onChange: PropTypes.func,
    dateFormat: PropTypes.string,
    allowPartial: PropTypes.bool,
    disabled: PropTypes.bool,
    months: PropTypes.array,
    floatingTitle: PropTypes.string,
    required: PropTypes.bool,
    hasError: PropTypes.string,
    disableFuture: PropTypes.bool,
    input: PropTypes.object,
    meta: PropTypes.shape({
        initial: PropTypes.string,
    }),
    partialDateFormId: PropTypes.string.isRequired,
    clearable: PropTypes.bool,
};

export default React.memo(PartialDateForm);
