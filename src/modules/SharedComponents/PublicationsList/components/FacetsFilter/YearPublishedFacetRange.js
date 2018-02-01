import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import {FACET_TYPE_RANGE} from 'config';
import {locale} from 'locale';

export default class YearPublishedFacetRange extends React.Component {
    static propTypes = {
        onFacetApplied: PropTypes.func,
        handleFacetClick: PropTypes.func,
        activeFacets: PropTypes.object,
        disabled: PropTypes.bool,
        from: PropTypes.number,
        to: PropTypes.number,
        index: PropTypes.number
    };

    static defaultProps = {
        from: 1901,
        to: (new Date()).getFullYear()
    };

    constructor(props) {
        super(props);
        // always keep props/state in sync
        const title = locale.components.facetsFilter.yearPublishedFacet.title;

        if (props.activeFacets.hasOwnProperty(FACET_TYPE_RANGE) &&
            props.activeFacets[FACET_TYPE_RANGE].hasOwnProperty(title)) {
            const range = props.activeFacets[FACET_TYPE_RANGE][title].match(/\d\d\d\d/g);
            this.state = {
                from: range[0],
                to: range[1]
            };
        } else {
            this.state = {
                from: this.props.from,
                to: this.props.to
            };
        }
    }

    setFromValue = (event, value) => {
        const validValue = isNaN(value) ? '*' : value;
        this.setState({
            from: validValue < 1000 ? `0${validValue}` : validValue
        });
    };

    setToValue = (event, value) => {
        const validValue = isNaN(value) ? '*' : value;
        this.setState({
            to: validValue < 1000 ? `0${validValue}` : validValue
        });
    };

    render() {
        const txt = locale.components.facetsFilter.yearPublishedFacet;
        const isActive = this.props.activeFacets.hasOwnProperty(FACET_TYPE_RANGE) && this.props.activeFacets[FACET_TYPE_RANGE].hasOwnProperty(txt.title);
        return (
            <div className="facetsYear">
                <ListItem
                    key={`key_facet_item_${this.props.index}`}
                    primaryText={txt.facetTitle}
                    open={this.props.activeFacets.hasOwnProperty(FACET_TYPE_RANGE) && this.props.activeFacets[FACET_TYPE_RANGE][txt.title] && true}
                    disabled={this.props.disabled}
                    className={'facetsYearCategory ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                    primaryTogglesNestedList
                    nestedItems={[
                        <ListItem
                            key="key_facet_item"
                            id="activeYearPublishedFacet"
                            className={'facetsYearLink ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                            primaryText={isActive ? `${this.state.from} - ${this.state.to}` : ''}
                            onClick={isActive ? () => (this.props.handleFacetClick(txt.title, `[${this.state.from} TO ${this.state.to}]`, FACET_TYPE_RANGE)) : () => {}}
                            disabled={this.props.disabled}
                            leftIcon={isActive ? <NavigationClose disabled={this.props.disabled} /> : null}
                        >
                            {
                                !isActive &&
                                <div className="yearPublished columns is-gapless">
                                    <div className="facetsYearFrom column">
                                        <TextField
                                            type="number"
                                            min={Math.max(txt.minYearValue, this.props.from)}
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
                                            max={this.props.to}
                                            floatingLabelText={txt.toFieldLabel}
                                            defaultValue={this.state.to}
                                            onChange={this.setToValue}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="facetsYearSeparator column is-narrow" />
                                    <div className="facetsYearGo column is-narrow">
                                        <FlatButton
                                            label="Go"
                                            onClick={() => (this.props.handleFacetClick(txt.title, `[${this.state.from} TO ${this.state.to}]`, FACET_TYPE_RANGE))}
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
