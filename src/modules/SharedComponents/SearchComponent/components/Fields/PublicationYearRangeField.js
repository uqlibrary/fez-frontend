import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import locale from 'locale/components';
import {withStyles} from '@material-ui/core/styles';

export const styles = theme => ({
    title: {
        ...theme.typography.caption
    }
});

export class PublicationYearRangeField extends PureComponent {
    static propTypes = {
        yearFilter: PropTypes.object,
        updateYearRangeFilter: PropTypes.func.isRequired,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        invalid: PropTypes.bool,
        classes: PropTypes.object
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
            invalid: !!this.isInvalidYear({...this.props.yearFilter, [key]: isNaN(intValue) ? 0 : intValue})
        });
    };

    isInvalidYear = values => {
        const from = values.from;
        const to = values.to;
        return (from > to || from > 9999 || to > 9999);
    };

    render() {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes.facet_year_range;
        const {classes} = this.props;
        return (
            <React.Fragment>
                <Grid container>
                    <Grid item xs={12}>
                        <InputLabel shrink className={classes.title}>{txt.title}</InputLabel>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item zeroMinWidth style={{flexGrow: 1, width: 1}}>
                        <InputLabel hidden id="from-label">{txt.fromAria}</InputLabel>
                        <TextField
                            fullWidth
                            id="from"
                            value={this.props.yearFilter.from ? `${this.props.yearFilter.from}` : ''}
                            onChange={this.setValue('from')}
                            error={!!this.props.invalid}
                            helperText={this.props.invalid && txt.invalidText}
                            placeholder={txt.fromHint}
                            aria-label={txt.fromAria}
                            inputProps={{
                                'aria-labelledby': 'from-label'
                            }}
                            disabled={this.props.disabled}
                        />
                    </Grid>
                    <Grid item xs={'auto'}>
                        <InputLabel hidden id="combiner-label">to</InputLabel>
                        <TextField
                            style={{width: 24}}
                            value={' to '}
                            disabled
                            inputProps={{
                                'aria-labelledby': 'combiner-label'
                            }}
                            InputProps={{disableUnderline: true}}
                        />
                    </Grid>
                    <Grid item zeroMinWidth style={{flexGrow: 1, width: 1}}>
                        <InputLabel hidden id="to-label">{txt.toAria}</InputLabel>
                        <TextField
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
                                'aria-labelledby': 'to-label'
                            }}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(PublicationYearRangeField);

