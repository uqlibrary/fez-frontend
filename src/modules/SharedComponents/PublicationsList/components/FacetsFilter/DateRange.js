import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import Grid from '@material-ui/core/Grid';

export default class DateRange extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        value: PropTypes.object,
        defaultValue: PropTypes.object,
        open: PropTypes.bool,
        locale: PropTypes.object,
        itemClassName: PropTypes.string,
        subitemClassName: PropTypes.string
    };

    static defaultProps = {
        value: {
            from: null,
            to: null
        },
        defaultValue: {
            from: (new Date()).getFullYear() - 10,
            to: (new Date()).getFullYear() + 5
        },
        locale: {
            fromFieldLabel: 'From',
            toFieldLabel: 'To',
            rangeSubmitButtonLabel: 'Go',
            displayTitle: 'Date range'
        },
        itemClassName: 'dateRange',
        subitemClassName: 'dateRage'
    };

    constructor(props) {
        super(props);
        this.state = {
            from: this.props.value.from || this.props.defaultValue.from,
            to: this.props.value.to || this.props.defaultValue.to,
            isActive: !!this.props.value.from || !!this.props.value.to
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            from: nextProps.value.from || this.props.defaultValue.from,
            to: nextProps.value.to || this.props.defaultValue.to,
            isActive: !!nextProps.value.from || !!nextProps.value.to
        });
    }

    setValue = (key) => (event) => {
        const intValue = parseInt(event.target.value, 10);
        this.setState({
            [key]: isNaN(intValue) || intValue < 0 || intValue > 9999 ? '*' : intValue
        });
    };

    setDateRange = () => {
        this.setState({isActive: true});
        const isFromYearSet = !isNaN(parseInt(this.state.from, 10));
        const isToYearSet = !isNaN(parseInt(this.state.to, 10));

        this.props.onChange({from: isFromYearSet ? this.state.from : null, to: isToYearSet ? this.state.to : null});
    };

    renderDateRangeForm = () => (
        <Grid container spacing={16} wrap={'nowrap'} alignItems={'flex-end'}>
            <Grid item xs={4}>
                <TextField
                    type="number"
                    label={this.props.locale.fromFieldLabel}
                    value={this.state.from}
                    onChange={this.setValue('from')}
                    disabled={this.props.disabled}
                    fullWidth/>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    type="number"
                    label={this.props.locale.toFieldLabel}
                    value={this.state.to}
                    onChange={this.setValue('to')}
                    disabled={this.props.disabled}
                    fullWidth/>
            </Grid>
            <Grid item>
                <Button
                    variant="flat"
                    children={this.props.locale.rangeSubmitButtonLabel}
                    onClick={this.setDateRange}
                    disabled={this.props.disabled || (!isNaN(this.state.to - this.state.from) && (this.state.to - this.state.from) < 0)}
                    fullWidth/>
            </Grid>
        </Grid>
    );

    removeDateRange = () => {
        if (this.state.isActive) {
            this.setState({isActive: false});
            this.props.onChange({from: null, to: null});
        }
    }

    getNestedItem = () => {
        const isActive = this.state.isActive;
        return (
            <ListItem
                key="dateRangeItem"
                className={`${this.props.subitemClassName} ${(isActive ? 'active ' : '')} ${(this.props.disabled ? 'disabled' : '')}`}
                primaryText={isActive ? `${this.state.from} - ${this.state.to}` : ''}
                disabled={this.props.disabled}
                onClick={this.removeDateRange}
                leftIcon={isActive ? <NavigationClose disabled={this.props.disabled} /> : null}>
                {
                    !isActive && this.renderDateRangeForm()
                }
            </ListItem>
        );
    }

    render() {
        const txt = this.props.locale;
        return (
            <ListItem
                open={this.props.open}
                primaryText={txt.displayTitle}
                disabled={this.props.disabled}
                className={`${this.props.itemClassName} ${(this.state.isActive ? 'active ' : '')} ${(this.props.disabled ? 'disabled' : '')}`}
                primaryTogglesNestedList
                nestedItems={[this.getNestedItem()]} />
        );
    }
}
