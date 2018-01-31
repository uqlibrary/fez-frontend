/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {ListItem} from 'material-ui/List';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import {locale} from 'locale';

export default class YearPublishedFacetFilter extends React.Component {
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
        from: 500,
        to: (new Date()).getFullYear()
    };

    constructor(props) {
        super(props);
        // always keep props/state in sync
        this.state = {
            from: this.props.from,
            to: this.props.to
        };
    }

    setFromValue = (event, value) => {
        this.setState({
            from: parseInt(value)
        });
    };

    setToValue = (event, value) => {
        this.setState({
            to: parseInt(value)
        });
    };

    render() {
        const txt = locale.components.facetsFilter.yearPublishedFacet;
        const isActive = this.props.activeFacets.hasOwnProperty(txt.title);
        return (
            <ListItem
                key={`key_facet_item_${this.props.index}`}
                primaryText={txt.title}
                open={this.props.activeFacets[txt.title] && true}
                disabled={this.props.disabled}
                className={'facetsCategory ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                primaryTogglesNestedList
                nestedItems={[
                    isActive ?
                        <ListItem
                            key="key_facet_item"
                            id="activeYearPublishedFacet"
                            className={'facetsLink ' + (isActive ? 'active ' : '') + (this.props.disabled ? 'disabled' : '')}
                            primaryText={`${this.state.from} - ${this.state.to}`}
                            onClick={() => (this.props.handleFacetClick(txt.title, `[${this.state.from} TO ${this.state.to}]`))}
                            disabled={this.props.disabled}
                            leftIcon={<NavigationClose disabled={this.props.disabled} />}
                        /> :
                        <ListItem key="key_facet_item">
                            <div className="yearPublished">
                                <div className="from">
                                    <TextField
                                        type="number"
                                        min={Math.max(txt.minYearValue, this.props.from)}
                                        max={this.state.to}
                                        floatingLabelText={txt.fromFieldLabel}
                                        defaultValue={this.state.from}
                                        onChange={this.setFromValue}
                                    />
                                </div>
                                <div className="to">
                                    <TextField
                                        type="number"
                                        min={this.state.from}
                                        max={this.props.to}
                                        floatingLabelText={txt.toFieldLabel}
                                        defaultValue={this.state.to}
                                        onChange={this.setToValue}
                                    />
                                </div>
                                <FlatButton label="Go" onClick={() => (this.props.handleFacetClick(txt.title, `[${this.state.from} TO ${this.state.to}]`))} />
                            </div>
                        </ListItem>
                ]}
            />
        );
    }
}
