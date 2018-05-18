import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import {locale} from 'locale';
import {routes} from 'config';


export default class SearchComponent extends PureComponent {
    static propTypes = {
        searchQueryParams: PropTypes.object,
        applyInverseStyle: PropTypes.bool,
        showAdvancedSearchButton: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showPrefixIcon: PropTypes.bool,
        showMobileSearch: PropTypes.bool,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: props.searchQueryParams && props.searchQueryParams.title || '',
            showAdvancedSearch: false,
            showMobile: false
        };
        this.MIN_SEARCH_TEXT_LENGTH = 10;
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.searchQueryParams && nextProps.searchQueryParams.title !== this.state.searchText) {
            this.setState({
                searchText: nextProps.searchQueryParams.title || ''
            });
        }
    }

    handleSearch = (event) => {
        if(event && event.key && (event.key !== 'Enter' || this.state.searchText.trim().length < this.MIN_SEARCH_TEXT_LENGTH)) return;

        if (this.props.actions && this.props.actions.searchEspacePublications && this.state.searchText.trim().length >= this.MIN_SEARCH_TEXT_LENGTH) {
            // start search
            const defaultQueryParams = {
                page: 1,
                pageSize: 20,
                sortBy: locale.components.sorting.sortBy[0].value,
                sortDirection: locale.components.sorting.sortDirection[0],
                activeFacets: {filters: {}, ranges: {}}
            };

            this.props.actions.searchEspacePublications({searchQueryParams: {title: this.state.searchText}, ...defaultQueryParams});
            // navigate to search results page
            this.props.history.push(routes.pathConfig.records.search);
        }
    }

    toggleMobile = (event) => {
        event.preventDefault();
        if (!this.state.showMobile) {
            this.setState({showMobile: true});
        } else {
            this.setState({showMobile: false});
        }
        console.log('Mobile: ', this.state.showMobile);
    };

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
                        <div className={`column search-field is-gapless ${this.state.showMobile ? 'showMobile' : 'hideMobile'}`}>
                            <div className="columns is-gapless search-field is-mobile">
                                {
                                    this.props.showPrefixIcon &&
                                    <div className="column is-narrow search-icon-prefix is-hidden-mobile">
                                        <SearchIcon/>
                                    </div>
                                }
                                {
                                    this.props.showMobileSearch &&
                                    <div className="column is-narrow search-icon-prefix is-hidden-tablet">
                                        <IconButton
                                            onClick={this.toggleMobile}
                                            className="mobileBackArrow"
                                        >
                                            <ArrowBack/>
                                        </IconButton>
                                    </div>
                                }
                                <div className="column">
                                    <TextField
                                        type="search"
                                        id="searchField"
                                        fullWidth
                                        hintText={txt.searchBoxPlaceholder}
                                        onChange={this.searchTextChanged}
                                        onKeyPress={this.handleSearch}
                                        value={this.state.searchText}
                                        underlineStyle={this.props.applyInverseStyle && {display: 'none'}}
                                    />
                                </div>
                                <div className="is-hidden-tablet mobileSpacer" />
                            </div>
                        </div>
                        {
                            this.props.showMobileSearch &&
                            <div className="column is-narrow is-hidden-tablet">
                                <IconButton
                                    onClick={this.toggleMobile}
                                    tooltipPosition="bottom-left"
                                    className="search-button"
                                    hoveredStyle={{backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%'}}
                                >
                                    <SearchIcon/>
                                </IconButton>
                            </div>
                        }
                        {
                            this.props.showSearchButton &&
                            <div className="column is-narrow search-button-wrapper">
                                <IconButton
                                    tooltipPosition="bottom-left"
                                    onClick={this.handleSearch}
                                    disabled={this.state.searchText.trim().length < this.MIN_SEARCH_TEXT_LENGTH}
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
                                    secondary
                                    disabled={this.state.searchText.trim().length < this.MIN_SEARCH_TEXT_LENGTH}
                                    onClick={this.handleSearch}
                                    fullWidth
                                />
                            </div>
                        }
                        {
                            this.props.showAdvancedSearchButton && false &&
                            <div className="column is-narrow">
                                <RaisedButton
                                    label={txt.advancedSearchButtonText}
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
