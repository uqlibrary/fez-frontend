import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import locale from 'locale/components';

export const PublicationYearRangeField = ({
    yearFilter = {
        from: null,
        to: null,
        valid: true,
    },
    updateYearRangeFilter,
    disabled = false,
    invalid,
}) => {
    const isInvalidYear = values => {
        const from = values.from;
        const to = values.to;
        return from > to || from > 9999 || to > 9999;
    };

    const setValue = key => event => {
        const value = event.target.value.toString();
        let intValue = value.replace(/\D/g, '');
        intValue = parseInt(intValue, 10);
        updateYearRangeFilter({
            ...yearFilter,
            [key]: isNaN(intValue) ? 0 : intValue,
            invalid: !!isInvalidYear({ ...yearFilter, [key]: isNaN(intValue) ? 0 : intValue }),
        });
    };

    const txt = locale.components.searchComponent.advancedSearch.fieldTypes.facet_year_range;
    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant={'caption'} color={'secondary'}>
                        {txt.title}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item zeroMinWidth sx={{ flexGrow: 1, width: '1px' }}>
                    <TextField
                        variant="standard"
                        fullWidth
                        id="from"
                        value={yearFilter.from ? `${yearFilter.from}` : ''}
                        onChange={setValue('from')}
                        error={!!invalid}
                        helperText={invalid && txt.invalidText}
                        placeholder={txt.fromHint}
                        aria-label={txt.fromAria}
                        disabled={disabled}
                        slotProps={{
                            htmlInput: {
                                'aria-labelledby': 'from-label',
                                'data-testid': 'from',
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={'auto'}>
                    <TextField
                        variant="standard"
                        sx={{ width: '24px' }}
                        value={' to '}
                        disabled
                        slotProps={{
                            input: {
                                disableUnderline: true,
                                'aria-labelledby': 'combiner-label',
                            },
                        }}
                    />
                </Grid>
                <Grid item zeroMinWidth sx={{ flexGrow: 1, width: '1px' }}>
                    <TextField
                        variant="standard"
                        fullWidth
                        id="to"
                        aria-labelledby={'to-label'}
                        value={yearFilter.to ? `${yearFilter.to}` : ''}
                        onChange={setValue('to')}
                        error={!!invalid}
                        placeholder={txt.toHint}
                        aria-label={txt.toAria}
                        disabled={disabled}
                        slotProps={{
                            htmlInput: {
                                'aria-labelledby': 'to-label',
                                'data-testid': 'to',
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

PublicationYearRangeField.propTypes = {
    yearFilter: PropTypes.object,
    updateYearRangeFilter: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    invalid: PropTypes.bool,
};

export default React.memo(PublicationYearRangeField);
