import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import locale from 'locale/components';

export default class PublicationYearRangeField extends PureComponent {
    static propTypes = {
        yearFilter: PropTypes.object,
        updateYearRangeFilter: PropTypes.func.isRequired,
        className: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        className: 'publicationyearrange menuitem',
        yearFilter: {
            from: null,
            to: null,
            valid: true
        },
        disabled: false
    };

    setValue = (key) => (event) => {
        const value = event.target.value.toString();
        let intValue = value.replace(/\D/g, '');
        intValue = parseInt(intValue, 10);
        this.props.updateYearRangeFilter({
            ...this.props.yearFilter,
            [key]: isNaN(intValue) ? 0 : intValue,
            invalid: !this.isValidText()
        });
    };

    isValidText = () => {
        const from = parseInt(this.props.yearFilter.from, 10);
        const to = parseInt(this.props.yearFilter.to, 10);
        return (from > to) || (from > 0 && !to) || (!from && to > 0) || (from > 9999) || (to > 9999)
            ? locale.components.searchComponent.advancedSearch.fieldTypes.facet_year_range.invalidText : null;
    };

    render() {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes.facet_year_range;
        return (
            <Grid container wrap={'nowrap'} alignContent={'center'} justify={'center'}>
                <Grid item zeroMinWidth style={{flexGrow: 1}}>
                    <TextField
                        fullWidth
                        id={'to'}
                        value={this.props.yearFilter.from ? `${this.props.yearFilter.from}` : ''}
                        InputLabelProps={{shrink: true}}
                        label={txt.title}
                        onChange={this.setValue('from')}
                        error={!!this.isValidText()}
                        helperText={this.isValidText()}
                        placeholder={txt.fromHint}
                        aria-label={txt.fromAria}
                        disabled={this.props.disabled}
                    />
                </Grid>
                <Grid item xs={'auto'}>
                    <TextField
                        style={{width: 24}}
                        value={' to '}
                        disabled
                        label={' '}
                        InputProps={{disableUnderline: true}}
                    />
                </Grid>
                <Grid item zeroMinWidth style={{flexGrow: 1}}>
                    <TextField
                        fullWidth
                        id={'from'}
                        InputLabelProps={{shrink: true}}
                        value={this.props.yearFilter.to ? `${this.props.yearFilter.to}` : ''}
                        label={' '}
                        onChange={this.setValue('to')}
                        error={this.isValidText() && ' '}
                        placeholder={txt.toHint}
                        aria-label={txt.toAria}
                        disabled={this.props.disabled}
                    />
                </Grid>
            </Grid>
        );
    }
}
