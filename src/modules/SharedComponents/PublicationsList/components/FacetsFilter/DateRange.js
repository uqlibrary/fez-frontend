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
        minYearValue: PropTypes.number,
        maxYearValue: PropTypes.number,
        index: PropTypes.number,
        facetValueOnActive: PropTypes.object,
        open: PropTypes.bool,
        facetTitle: PropTypes.string,
        title: PropTypes.string.isRequired,
        displayTitle: PropTypes.string.isRequired,
        locale: PropTypes.object
    };

    static defaultProps = {
        minYearValue: 2010,
        maxYearValue: (new Date()).getFullYear() + 5,
        facetValueOnActive: {
            from: null,
            to: null
        },
        locale: {
            fromFieldLabel: 'From',
            toFieldLabel: 'To',
            rangeSubmitButtonLabel: 'Go'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            from: this.props.facetValueOnActive.from || this.props.minYearValue,
            to: this.props.facetValueOnActive.to || this.props.maxYearValue
        };
    }

    setFromValue = (event, value) => {
        this.setState({
            from: isNaN(parseInt(value, 10)) ? undefined : ('0000' + value).substr(-4)
        });
    };

    setToValue = (event, value) => {
        this.setState({
            to: isNaN(parseInt(value, 10)) ? undefined : ('0000' + value).substr(-4)
        });
    };

    _handleRangeFacetClick = () => {
        return this.props.onChange(this.props.title, this.state.from, this.state.to);
    };

    render() {
        const txt = this.props.locale;
        const {displayTitle, disabled, index, open, isActive, minYearValue, maxYearValue} = this.props;

        const activeClass = isActive ? ' active' : '';
        const disabledClass = disabled ? ' disabled' : '';

        return (
            <div className="facetsYear">
                <ListItem
                    key={`key_facet_item_${index}`}
                    primaryText={displayTitle}
                    open={open}
                    disabled={disabled}
                    className={`facetsYearCategory${activeClass}${disabledClass}`}
                    primaryTogglesNestedList
                    nestedItems={[
                        <ListItem
                            key="key_facet_item"
                            id="activeYearPublishedFacet"
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
                                            min={minYearValue}
                                            max={this.state.to}
                                            floatingLabelText={txt.fromFieldLabel}
                                            defaultValue={this.state.from}
                                            onChange={this.setFromValue}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="facetsYearSeparator column is-narrow" />
                                    <div className="facetsYearTo column">
                                        <TextField
                                            type="number"
                                            min={this.state.from}
                                            max={maxYearValue}
                                            floatingLabelText={txt.toFieldLabel}
                                            defaultValue={this.state.to}
                                            onChange={this.setToValue}
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
