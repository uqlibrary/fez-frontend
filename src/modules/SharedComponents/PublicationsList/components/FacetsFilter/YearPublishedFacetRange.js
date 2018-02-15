import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import {locale} from 'locale';

export default class YearPublishedFacetRange extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        activeFacets: PropTypes.object,
        disabled: PropTypes.bool,
        minYearValue: PropTypes.number,
        maxYearValue: PropTypes.number,
        index: PropTypes.number
    };

    static defaultProps = {
        minYearValue: locale.components.facetsFilter.yearPublishedFacet.minYearValue,
        maxYearValue: (new Date()).getFullYear() + 5
    };

    constructor(props) {
        super(props);
        // always keep props/state in sync
        const title = locale.components.facetsFilter.yearPublishedFacet.title;

        if (props.activeFacets.hasOwnProperty('ranges') &&
            props.activeFacets.ranges.hasOwnProperty(title)) {
            const range = props.activeFacets.ranges[title].match(/\d\d\d\d/g);
            this.state = {
                from: range[0],
                to: range[1]
            };
        } else {
            this.state = {
                from: this.props.minYearValue,
                to: this.props.maxYearValue
            };
        }
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
        const txt = locale.components.facetsFilter.yearPublishedFacet;
        const parsedFromValue = parseInt(this.state.from, 10);
        const parsedToValue = parseInt(this.state.to, 10);
        const from = parsedFromValue > parsedToValue ? this.state.to : (this.state.from || '*');
        const to = parsedToValue < parsedFromValue ? this.state.from : (this.state.to || '*');

        return this.props.onChange(txt.title, `[${from} TO ${to}]`, 'ranges');
    };

    render() {
        const txt = locale.components.facetsFilter.yearPublishedFacet;
        const isActive = this.props.activeFacets.hasOwnProperty('ranges') && this.props.activeFacets.ranges.hasOwnProperty(txt.title);
        const activeClass = isActive ? ' active ' : '';
        const disabledClass = this.props.disabled ? ' disabled' : '';

        return (
            <div className="facetsYear">
                <ListItem
                    key={`key_facet_item_${this.props.index}`}
                    primaryText={txt.facetTitle}
                    open={isActive}
                    disabled={this.props.disabled}
                    className={`facetsYearCategory${activeClass}${disabledClass}`}
                    primaryTogglesNestedList
                    nestedItems={[
                        <ListItem
                            key="key_facet_item"
                            id="activeYearPublishedFacet"
                            className={`facetsYearLink${activeClass}${disabledClass}`}
                            primaryText={isActive ? `${this.state.from || '*'} - ${this.state.to || '*'}` : ''}
                            onClick={isActive ? this._handleRangeFacetClick : () => {}}
                            disabled={this.props.disabled}
                            leftIcon={isActive ? <NavigationClose disabled={this.props.disabled} /> : null}
                        >
                            {
                                !isActive &&
                                <div className="yearPublished columns is-gapless">
                                    <div className="facetsYearFrom column">
                                        <TextField
                                            type="number"
                                            min={this.props.minYearValue}
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
                                            max={this.props.maxYearValue}
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
