import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

export default class DateRange extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        isActive: PropTypes.bool,
        value: PropTypes.object,
        defaultValue: PropTypes.object,
        open: PropTypes.bool,
        locale: PropTypes.object
    };

    static defaultProps = {
        value: {
            from: null,
            to: null
        },
        defaultValue: {
            from: 2010,
            to: (new Date()).getFullYear() + 5
        },
        locale: {
            fromFieldLabel: 'From',
            toFieldLabel: 'To',
            rangeSubmitButtonLabel: 'Go',
            displayTitle: 'Date range'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            from: this.props.value.from || this.props.defaultValue.from,
            to: this.props.value.to || this.props.defaultValue.to,
            isActive: !!this.props.value.from || !!this.props.value.to
        };
    }

    setValue = (key) => (event, value) => {
        this.setState({
            [key]: isNaN(parseInt(value, 10)) ? undefined : ('0000' + value).substr(-4)
        });
    };

    _handleRangeFacetClick = () => {
        this.setState({isActive: !this.state.isActive});
        return this.props.onChange(this.state.from, this.state.to);
    };

    render() {
        const txt = this.props.locale;
        const {disabled, open} = this.props;
        const {isActive} = this.state;
        const activeClass = isActive ? ' active' : '';
        const disabledClass = disabled ? ' disabled' : '';

        return (
            <div className="facetsYear">
                <ListItem
                    primaryText={txt.displayTitle}
                    open={open}
                    disabled={disabled}
                    className={`facetsYearCategory${activeClass}${disabledClass}`}
                    primaryTogglesNestedList
                    nestedItems={[
                        <ListItem
                            key="key_facet_item"
                            className={`facetsYearLink${activeClass}${disabledClass}`}
                            primaryText={isActive ? `${this.state.from || '*'} - ${this.state.to || '*'}` : ''}
                            onClick={isActive ? this._handleRangeFacetClick : () => {}}
                            disabled={disabled}
                            leftIcon={isActive ? <NavigationClose disabled={disabled} /> : null}
                        >
                            {
                                !isActive &&
                                <div className="yearPublished columns is-gapless">
                                    <div className="facetsYearFrom column">
                                        <TextField
                                            type="number"
                                            floatingLabelText={txt.fromFieldLabel}
                                            defaultValue={this.state.from}
                                            onChange={this.setValue('from')}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="facetsYearSeparator column is-narrow" />
                                    <div className="facetsYearTo column">
                                        <TextField
                                            type="number"
                                            floatingLabelText={txt.toFieldLabel}
                                            defaultValue={this.state.to}
                                            onChange={this.setValue('to')}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="facetsYearSeparator column is-narrow" />
                                    <div className="facetsYearGo column is-narrow">
                                        <FlatButton
                                            label={txt.rangeSubmitButtonLabel}
                                            onClick={this._handleRangeFacetClick}
                                            className="is-mui-spacing-button"
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            }
                        </ListItem>
                    ]}
                />
            </div>
        );
    }
}
