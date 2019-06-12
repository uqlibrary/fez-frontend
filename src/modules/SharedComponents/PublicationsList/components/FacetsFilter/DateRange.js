
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FacetFilterListItem from './FacetFilterListItem';
import FacetFilterNestedListItem from './FacetFilterNestedListItem';

export const DateRangeForm = ({from, to, setFrom, setTo, setDateRange, locale, disabled}) => {
    return (
        <div style={{padding: 8}}>
            <Grid container spacing={16} wrap={'nowrap'} alignItems={'flex-end'}>
                <Grid item xs={4}>
                    <TextField
                        type="number"
                        name="from"
                        id="from"
                        label={locale.fromFieldLabel}
                        defaultValue={from}
                        onChange={setFrom}
                        disabled={disabled}
                        fullWidth/>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        type="number"
                        name="to"
                        id="to"
                        label={locale.toFieldLabel}
                        defaultValue={to}
                        onChange={setTo}
                        disabled={disabled}
                        fullWidth/>
                </Grid>
                <Grid item>
                    <Button
                        variant="text"
                        children={locale.rangeSubmitButtonLabel}
                        onClick={setDateRange}
                        disabled={disabled || (!isNaN(to - from) && (to - from) < 0)}
                        fullWidth/>
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
    locale: PropTypes.object
};

export const DateRange = ({disabled, value, open, locale, onChange, onToggle, isActive}) => {
    const [active, setActive] = useState(isActive);
    const [range, setRange] = useState(value);

    const handleChange = (event) => {
        const {name, value} = event.target;
        const intValue = parseInt(value, 10);
        setRange({
            ...range,
            [name]: isNaN(intValue) || !intValue || intValue < 0 || intValue > 9999 ? undefined : intValue
        });
    };

    const setDateRange = () => {
        setActive(true);
        const isFromYearSet = !isNaN(parseInt(range.from, 10));
        const isToYearSet = !isNaN(parseInt(range.to, 10));

        onChange({from: isFromYearSet ? range.from : null, to: isToYearSet ? range.to : null});
    };

    const removeDateRange = () => {
        setActive(false);
        setRange({
            from: null,
            to: null
        });

        onChange({from: null, to: null});
    };

    const txt = locale;
    return (
        <FacetFilterListItem
            key="date-range"
            facetTitle={txt.displayTitle}
            disabled={disabled}
            onToggle={onToggle}
            open={open}
        >
            {
                !active
                    ? <DateRangeForm
                        from={range.from}
                        to={range.to}
                        setFrom={handleChange}
                        setTo={handleChange}
                        setDateRange={setDateRange}
                        locale={locale}
                        disabled={disabled}
                    />
                    : <FacetFilterNestedListItem
                        onFacetClick={removeDateRange}
                        isActive={active}
                        primaryText={`${range.from || '*'} - ${range.to || '*'}`}
                        disabled={disabled}
                    />
            }
        </FacetFilterListItem>
    );
};

DateRange.propTypes = {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    open: PropTypes.bool,
    isActive: PropTypes.bool,
    locale: PropTypes.object,
    onToggle: PropTypes.func.isRequired
};

DateRange.defaultProps = {
    value: {
        from: (new Date()).getFullYear() - 10,
        to: (new Date()).getFullYear() + 5
    },
    locale: {
        fromFieldLabel: 'From',
        toFieldLabel: 'To',
        rangeSubmitButtonLabel: 'Go',
        displayTitle: 'Date range'
    },
    isActive: false
};

export default React.memo(DateRange);
