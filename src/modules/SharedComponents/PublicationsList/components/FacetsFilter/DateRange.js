import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FacetFilterListItem from './FacetFilterListItem';
import FacetFilterNestedListItem from './FacetFilterNestedListItem';

export const DateRangeForm = ({ from, to, setFrom, setTo, setDateRange, locale, disabled }) => {
    return (
        <div style={{ padding: 8 }}>
            <Grid container spacing={2} wrap={'nowrap'} alignItems={'flex-end'}>
                <Grid item xs={4}>
                    <TextField
                        variant="standard"
                        type="number"
                        name="from"
                        id="from"
                        inputProps={{
                            'data-testid': 'from',
                        }}
                        label={locale.fromFieldLabel}
                        defaultValue={from}
                        onChange={setFrom}
                        disabled={disabled}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        variant="standard"
                        type="number"
                        name="to"
                        id="to"
                        inputProps={{
                            'data-testid': 'to',
                        }}
                        label={locale.toFieldLabel}
                        defaultValue={to}
                        onChange={setTo}
                        disabled={disabled}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="text"
                        children={locale.rangeSubmitButtonLabel}
                        onClick={setDateRange}
                        disabled={disabled || (!isNaN(to - from) && to - from < 0)}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </div>
    );
};

DateRangeForm.propTypes = {
    from: PropTypes.number,
    to: PropTypes.number,
    setFrom: PropTypes.func,
    setTo: PropTypes.func,
    setDateRange: PropTypes.func,
    disabled: PropTypes.bool,
    locale: PropTypes.object,
};

export const DateRange = ({
    disabled,
    value = {
        from: new Date().getFullYear() - 10,
        to: new Date().getFullYear() + 5,
    },
    locale = {
        fromFieldLabel: 'From',
        toFieldLabel: 'To',
        rangeSubmitButtonLabel: 'Go',
        displayTitle: 'Date range',
    },
    onChange,
    isActive = false,
    category,
}) => {
    const [range, setRange] = useState(value);

    const handleChange = event => {
        const { name, value } = event.target;
        const intValue = parseInt(value, 10);
        setRange({
            ...range,
            [name]: isNaN(intValue) || !intValue || intValue < 0 || intValue > 9999 ? undefined : intValue,
        });
    };

    const setDateRange = () => {
        const isFromYearSet = !isNaN(parseInt(range.from, 10));
        const isToYearSet = !isNaN(parseInt(range.to, 10));

        onChange(category, { from: isFromYearSet ? range.from : null, to: isToYearSet ? range.to : null }, true);
    };

    const removeDateRange = () => {
        setRange({
            from: null,
            to: null,
        });

        onChange(category, { from: null, to: null }, false);
    };

    const txt = locale;

    return (
        <FacetFilterListItem
            key="date-range"
            id="facet-category-date-range"
            title={txt.displayTitle}
            disabled={disabled}
            nestedItems={
                !isActive ? (
                    <DateRangeForm
                        from={range.from}
                        to={range.to}
                        setFrom={handleChange}
                        setTo={handleChange}
                        setDateRange={setDateRange}
                        locale={locale}
                        disabled={disabled}
                    />
                ) : (
                    <FacetFilterNestedListItem
                        onFacetClick={removeDateRange}
                        isActive={isActive}
                        primaryText={`${range.from || '*'} - ${range.to || '*'}`}
                        disabled={disabled}
                        index="date-range"
                    />
                )
            }
        />
    );
};

DateRange.propTypes = {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    isActive: PropTypes.bool,
    locale: PropTypes.object,
    category: PropTypes.string,
};

export default React.memo(DateRange);
