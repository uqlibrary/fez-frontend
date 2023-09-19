import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import locale from 'locale/components';

export default class PublicationYearRangeField extends PureComponent {
    static propTypes = {
        yearFilter: PropTypes.object,
        updateYearRangeFilter: PropTypes.func.isRequired,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        invalid: PropTypes.bool,
    };

    static defaultProps = {
        className: 'publicationyearrange menuitem',
        yearFilter: {
            from: null,
            to: null,
            valid: true,
        },
        disabled: false,
    };

    setValue = key => event => {
        const value = event.target.value.toString();
        let intValue = value.replace(/\D/g, '');
        intValue = parseInt(intValue, 10);
        this.props.updateYearRangeFilter({
            ...this.props.yearFilter,
            [key]: isNaN(intValue) ? 0 : intValue,
            invalid: !!this.isInvalidYear({ ...this.props.yearFilter, [key]: isNaN(intValue) ? 0 : intValue }),
        });
    };

    isInvalidYear = values => {
        const from = values.from;
        const to = values.to;
        return from > to || from > 9999 || to > 9999;
    };

    render() {
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
                            value={this.props.yearFilter.from ? `${this.props.yearFilter.from}` : ''}
                            onChange={this.setValue('from')}
                            error={!!this.props.invalid}
                            helperText={this.props.invalid && txt.invalidText}
                            placeholder={txt.fromHint}
                            aria-label={txt.fromAria}
                            inputProps={{
                                'aria-labelledby': 'from-label',
                                'data-testid': 'from',
                            }}
                            disabled={this.props.disabled}
                        />
                    </Grid>
                    <Grid item xs={'auto'}>
                        <TextField
                            variant="standard"
                            sx={{ width: '24px' }}
                            value={' to '}
                            disabled
                            InputProps={{
                                disableUnderline: true,
                                'aria-labelledby': 'combiner-label',
                            }}
                        />
                    </Grid>
                    <Grid item zeroMinWidth sx={{ flexGrow: 1, width: '1px' }}>
                        <TextField
                            variant="standard"
                            fullWidth
                            id="to"
                            aria-labelledby={'to-label'}
                            value={this.props.yearFilter.to ? `${this.props.yearFilter.to}` : ''}
                            onChange={this.setValue('to')}
                            error={!!this.props.invalid}
                            placeholder={txt.toHint}
                            aria-label={txt.toAria}
                            disabled={this.props.disabled}
                            inputProps={{
                                'aria-labelledby': 'to-label',
                                'data-testid': 'to',
                            }}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
