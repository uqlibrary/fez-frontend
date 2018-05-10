import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';

import {locale} from 'locale';
import {routes} from 'config';

export default class SearchComponent extends PureComponent {
    static propTypes = {
        searchParams: PropTypes.object,
        applyInverseStyle: PropTypes.bool,
        showAdvancedSearchButton: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: props.searchParams && props.searchParams.title || '',
            showAdvancedSearch: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.searchParams && nextProps.searchParams.title !== this.state.searchText) {
            this.setState({
                searchText: nextProps.searchParams.title || ''
            });
        }
    }

    handleSearch = (event) => {
        if(event && event.key && (event.key !== 'Enter' || this.state.searchText.length === 0)) return;

        if (this.props.actions && this.props.actions.searchEspacePublications && this.state.searchText.length > 0) {
            // start search
            this.props.actions.searchEspacePublications({title: this.state.searchText});
            // navigate to search results page
            this.props.history.push(routes.pathConfig.records.search);
        }
    }

    searchTextChanged = (event, value) => {
        this.setState({
            searchText: value
        });
    }

    toggleAdvancedSearch = () => {
        this.setState({
            showAdvancedSearch: !this.state.showAdvancedSearch
        });
    }

    render() {
        const txt = locale.components.searchComponent;

        return (
            <div className={`search-component ${this.props.applyInverseStyle ? 'inverse' : ''}`}>
                {
                    !this.state.showAdvancedSearch &&
                    <div className="columns is-gapless">
                        <div className="column">
                            <div className="search-field">
                                <TextField
                                    id="searchField"
                                    fullWidth
                                    hintText={txt.searchBoxPlaceholder}
                                    onChange={this.searchTextChanged}
                                    onKeyPress={this.handleSearch}
                                    value={this.state.searchText}
                                />
                            </div>
                        </div>
                        {
                            this.props.showSearchButton &&
                            <div className="column is-narrow search-button-wrapper">
                                <IconButton
                                    tooltipPosition="bottom-left"
                                    onClick={this.handleSearch}
                                    hoveredStyle={{backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%'}}
                                    className="search-button"
                                    tooltip={txt.searchButtonHint}>
                                    <SearchIcon/>
                                </IconButton>
                            </div>
                        }
                        {
                            this.props.showAdvancedSearchButton &&
                            <div className="column is-narrow">
                                <RaisedButton
                                    label={txt.searchButtonText}
                                    onClick={this.handleSearch}/>
                            </div>
                        }
                        {
                            this.props.showAdvancedSearchButton &&
                            <div className="column is-narrow">
                                <RaisedButton
                                    label={txt.advancedSearchButtonText}
                                    secondary
                                    onClick={this.toggleAdvancedSearch}/>
                            </div>
                        }
                    </div>
                }
                {
                    this.state.showAdvancedSearch && this.props.showAdvancedSearchButton &&
                    <div className="columns">
                        <div className="column">
                        Advanced search component goes here
                        </div>
                        <div className="column is-narrow">
                            <RaisedButton
                                label={'Simple search'}
                                secondary
                                onClick={this.toggleAdvancedSearch}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
