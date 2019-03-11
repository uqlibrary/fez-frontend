import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import {withStyles} from '@material-ui/core/styles';
import {DatePickerField} from 'modules/SharedComponents/Toolbox/DatePickerField';
import {GENERIC_DATE_FORMAT} from 'config/general';

const styles = theme => ({
    title: {
        ...theme.typography.caption
    }
});

export class DateRangeField extends PureComponent {
    static propTypes = {
        searchKey: PropTypes.string,
        disabled: PropTypes.bool,
        invalid: PropTypes.bool,
        classes: PropTypes.object,
        locale: PropTypes.object,
        format: PropTypes.string,
        from: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object
        ]),
        to: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object
        ]),
        onChange: PropTypes.func.isRequired,
        disableFuture: PropTypes.bool
    };

    static defaultProps = {
        className: 'publicationyearrange menuitem',
        disabled: false,
        format: GENERIC_DATE_FORMAT,
        disableFuture: false
    };

    constructor(props) {
        super(props);
        this.state = {
            from: props.from || null,
            to: props.to || null,
            error: undefined
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            !!this.props.onChange &&
            (this.state.from !== nextState.from || this.state.to !== nextState.to || this.state.error !== nextState.error) &&
            !nextState.error
        ) this.props.onChange(nextState);
    }

    updateDateRangeValue = (key) => (value) => {
        this.setState({
            [key]: value
        }, () => {
            const {from, to} = this.state;
            if (!!from && !!to && from.isAfter(to)) {
                this.setState({
                    error: 'Please provide valid date range'
                });
            } else {
                this.setState({
                    error: undefined
                });
            }
        });
    };

    render() {
        const {classes, locale} = this.props;
        return (
            <React.Fragment>
                <Grid container>
                    <Grid item xs={12}>
                        <InputLabel shrink className={classes.title}>{locale.title}</InputLabel>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item zeroMinWidth style={{flexGrow: 1, width: 1}}>
                        <DatePickerField
                            value={this.state.from}
                            onChange={this.updateDateRangeValue('from')}
                            error={this.state.error}
                            errorText={this.state.error}
                            format={this.props.format}
                            disableFuture={this.props.disableFuture}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <TextField
                            style={{width: 24}}
                            value=" to "
                            disabled
                            InputProps={{disableUnderline: true}}
                        />
                    </Grid>
                    <Grid item zeroMinWidth style={{flexGrow: 1, width: 1}}>
                        <DatePickerField
                            value={this.state.to}
                            onChange={this.updateDateRangeValue('to')}
                            error={!!this.state.error}
                            format={this.props.format}
                            disableFuture={this.props.disableFuture}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(DateRangeField);

