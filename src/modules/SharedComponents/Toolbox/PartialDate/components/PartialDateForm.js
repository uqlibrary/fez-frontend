import React, { memo, useState, useEffect } from 'react';
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

/**
 * validate the entered date field
 * @param state
 * @returns {int} returns one of STATUS_VALID, STATUS_INVALID, STATUS_FUTURE_DATE, defined above
 * @private
 */
export const validate = ({ state, allowPartial, disableFuture = false, clearable = false }) => {
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

export const isNumber = locale => event => {
    if (event.charCode < locale.minNumberCharCode || event.charCode > locale.maxNumberCharCode) {
        event.preventDefault();
    }
};

export const isUnselected = month => {
    return month === MONTH_UNSELECTED || month === null;
};

export const displayErrors = ({
    state,
    setError,
    validationStatus,
    allowPartial,
    locale,
    clearable,
    required = '',
}) => {
    const isRequiredHere = required === '' ? undefined : required;
    const { day, month, year } = state;
    const validMonthIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    let date = '';
    switch (validationStatus) {
        case STATUS_INVALID:
            date =
                // initial load of 'required' message for required date fields
                /* istanbul ignore next */
                (allowPartial && isRequiredHere && !year && !isNaN(year) && locale.validationMessage.yearRequired) ||
                // initial load of 'required' message for required date fields
                /* istanbul ignore next */
                (isNaN(year) && locale.validationMessage.year) ||
                // they've just typed in a nonsense number
                // dont wait for date complete for the moment validation to kick in
                ((isNaN(day) || (!!day && (day < 1 || day > 31) && !allowPartial)) && locale.validationMessage.day) ||
                // // date fields initially blank // remove
                // (year === null && isUnselected(month) && day === null && '') || // remove
                // they've entered a day
                /* istanbul ignore next */
                (year === null && isUnselected(month) && !!day && allowPartial && ' ') ||
                // they've entered a day and a month
                /* istanbul ignore next */
                (year === null && validMonthIndices.includes(month) && !!day && !allowPartial && ' ') ||
                // encourage them to select a month if the year and day are selected
                /* istanbul ignore next */
                (!!year && isUnselected(month) && !!day && locale.validationMessage.month) ||
                (!!year && isUnselected(month) && !day && !allowPartial && ' ') ||
                locale.validationMessage.date;
            break;
        case STATUS_VALID:
            // cypress does not like more concise format (?!?) (integration tests didnt either?!?!?)
            if (!!year && validMonthIndices.includes(month) && !!day) {
                // date complete for non-partial-entry
                date = '';
            } else if (allowPartial && !!year && isUnselected(month) && !day) {
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
    setError(date.trim());
};

const PartialDateForm = props => {
    const {
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
    } = props;
    const getDateObject = () => {
        const dateValue =
            (value && moment(value)) ||
            (input && input.value && moment(input.value)) ||
            (meta && meta.initial && typeof meta.initial === 'string' && moment(meta.initial)) ||
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

    const [state, setState] = useState();
    const [error, setError] = useState();

    const getFullDateFromState = newState => {
        const validationStatus = validate({ state: newState, allowPartial, disableFuture, clearable });

        displayErrors({ state: newState, setError, validationStatus, allowPartial, required, clearable, locale });

        // moment validation doesn't recognise -1 as a valid date.
        const month = newState.month === MONTH_UNSELECTED ? null : newState.month;
        const day = isNaN(newState.day) || !newState.day ? null : newState.day;
        const momentDate = { ...newState, month, day };
        return validationStatus === STATUS_VALID ? moment(momentDate).format(dateFormat) : '';
    };

    const _onDateChanged = key => {
        return (event, index, value) => {
            const newState = { ...state };

            if (key === 'year' && event.target.value === '') {
                // Only clear the year field without affecting day and month
                newState.year = '';
            } else if (event.target.value === '') {
                // Allow clearing other fields normally
                newState[key] = '';
            } else {
                newState[key] = parseInt(
                    event.target.value === undefined ? /* istanbul ignore next */ value : event.target.value,
                    10,
                );
            }

            const validationStatus = validate({ state: newState, allowPartial, disableFuture, clearable });
            displayErrors({ state: newState, setError, validationStatus, allowPartial, required, clearable, locale });

            if (validationStatus !== STATUS_FUTURE_DATE) {
                const fullDate = getFullDateFromState(newState);
                setState(newState);
                if (key !== 'year' || newState.year !== '') {
                    onChange?.(fullDate) || input?.onChange?.(fullDate);
                }
            } else {
                setState(newState); // Keep the existing day and month when year is in the future
            }
        };
    };

    useEffect(() => {
        const newDateObject = getDateObject();
        /* istanbul ignore else */
        if (
            !!!state ||
            state.day !== newDateObject.day ||
            state.month !== newDateObject.month ||
            state.year !== newDateObject.year
        ) {
            const newState = { ...state, ...newDateObject };
            setState(newState);
            // check for errors
            (onChange || input?.onChange) && getFullDateFromState(newState);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

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
                            onKeyPress={isNumber(locale)}
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
                            value={state?.day || ''}
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
                            value={!!!state || state?.month === null ? /* istanbul ignore next */ -1 : state?.month}
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
                            onKeyPress={isNumber(locale)}
                            onChange={_onDateChanged('year')}
                            onBlur={_onDateChanged('year')}
                            inputProps={{
                                label: 'year',
                                maxLength: 4,
                                id: `${partialDateFormId}-year-input`,
                                'data-analyticsid': `${partialDateFormId}-year-input`,
                                'data-testid': `${partialDateFormId}-year-input`,
                            }}
                            value={state?.year || ''}
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
        // TODO - remove after RHF migration
        initial: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // added object type to avoid console errors
    }),
    partialDateFormId: PropTypes.string.isRequired,
    clearable: PropTypes.bool,
};

export default memo(PartialDateForm);
