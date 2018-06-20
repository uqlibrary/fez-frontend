import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import param from 'can-param';

import Snackbar from 'material-ui/Snackbar';
import {routes} from 'config';
import {defaultQueryParams} from 'config/general';
import {locale} from 'locale';

import SimpleSearchComponent from './SimpleSearchComponent';
import AdvancedSearchComponent from './AdvancedSearchComponent';

export default class SearchComponent extends PureComponent {
    static propTypes = {
        searchQueryParams: PropTypes.object,

        showSearchButton: PropTypes.bool,
        showMobileSearchButton: PropTypes.bool,
        showAdvancedSearchButton: PropTypes.bool,
        showPrefixIcon: PropTypes.bool,

        isInHeader: PropTypes.bool,
        isAdvancedSearch: PropTypes.bool,
        isAdvancedSearchMinimised: PropTypes.bool,
        isOpenAccessInAdvancedMode: PropTypes.bool,
        hasNoResults: PropTypes.bool,

        className: PropTypes.string,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired,
    };

    static defaultProps = {
        searchQueryParams: {},

        showSearchButton: false,
        showMobileSearchButton: false,
        showAdvancedSearchButton: false,
        showPrefixIcon: false,
        hasNoResults: false,

        isInHeader: false,
        isAdvancedSearch: false,
        isAdvancedSearchMinimised: false,
        isOpenAccessInAdvancedMode: false
    };

    constructor(props) {
        super(props);
        this.state = {
            snackbarOpen: false,
            snackbarMessage: '',
            isAdvancedSearch: props.isAdvancedSearch,
            simpleSearch: {
                searchText: props.searchQueryParams && props.searchQueryParams.all || ''
            },
            advancedSearch: {
                fieldRows: this.getFieldRowsFromSearchQuery(props.searchQueryParams),
                isMinimised: this.props.hasNoResults ? false : props.isAdvancedSearchMinimised,
                isOpenAccess: props.isOpenAccessInAdvancedMode || false,
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.searchQueryParams) {
            this.setState({
                isAdvancedSearch: nextProps.isAdvancedSearch,
                simpleSearch: {
                    searchText: nextProps.searchQueryParams.all || ''
                },
                advancedSearch: {
                    fieldRows: this.getFieldRowsFromSearchQuery(nextProps.searchQueryParams),
                    isMinimised: this.props.hasNoResults ? false : nextProps.isAdvancedSearchMinimised || false,
                    isOpenAccess: nextProps.isOpenAccessInAdvancedMode || false
                }
            });
        }
    }

    getFieldRowsFromSearchQuery = (searchQueryParams) => {
        if (!searchQueryParams || Object.keys(searchQueryParams).length === 0) {
            return [{
                searchField: '0',
                value: ''
            }];
        } else {
            return Object.keys(searchQueryParams).map(key => ({
                searchField: key,
                value: searchQueryParams[key]
            }));
        }
    };

    handleSearch = (searchQuery) => {
        if (searchQuery && this.props.actions && this.props.actions.searchEspacePublications) {
            this.props.actions.searchEspacePublications(searchQuery);

            // navigate to search results page
            this.props.history.push({
                pathname: routes.pathConfig.records.search,
                search: param(searchQuery),
                state: {...searchQuery}
            });
        }
    };

    _toggleSearchMode = () => {
        this.setState({
            isAdvancedSearch: !this.state.isAdvancedSearch,
            advancedSearch: {
                ...this.state.advancedSearch,
                isMinimised: false
            }
        });
    };

    _displaySnackbar = (message) => {
        this.setState({
            snackbarMessage: message,
            snackbarOpen: true
        });
    };

    /*
     *  ==============================
     *  Simple search handlers
     *  ==============================
     */
    _handleSimpleSearchTextChange = (value) => {
        this.setState({
            simpleSearch: {
                searchText: value
            },
            snackbarOpen: false
        });
    };

    _handleSimpleSearch = () => {
        const searchQuery = {searchQueryParams: {all: this.state.simpleSearch.searchText}, ...defaultQueryParams};

        // Perform search
        this.handleSearch(searchQuery);
    };

    /*
     *  ==============================
     *  Advanced search handlers
     *  ==============================
     */
    _toggleMinimise = () => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                isMinimised: !this.state.advancedSearch.isMinimised
            }
        });
    };

    _toggleOpenAccess = () => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                isOpenAccess: !this.state.advancedSearch.isOpenAccess
            }
        });
    };

    _addAdvancedSearchRow = () => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                fieldRows: [
                    ...this.state.advancedSearch.fieldRows,
                    {
                        searchField: '0',
                        value: '',
                    }
                ]
            }
        });
    };

    _removeAdvancedSearchRow = (index) => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                fieldRows: [
                    ...this.state.advancedSearch.fieldRows.slice(0, index),
                    ...this.state.advancedSearch.fieldRows.slice(index + 1)
                ]
            }
        });
    };

    _resetAdvancedSearch = () => {
        this.setState({
            advancedSearch: {
                isOpenAccess: false,
                fieldRows: [{
                    searchField: '0',
                    value: ''
                }]
            }
        });
    };

    _handleAdvancedSearchRowChange = (index, searchRow) => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                fieldRows: [
                    ...this.state.advancedSearch.fieldRows.slice(0, index),
                    searchRow,
                    ...this.state.advancedSearch.fieldRows.slice(index + 1)
                ]
            }
        });
    };

    _handleAdvancedSearch = () => {
        const searchQueryParams = this.state.advancedSearch.fieldRows
            .reduce((searchQueries, item) => (
                {...searchQueries, [item.searchField]: item.value}
            ), {});

        const {activeFacets} = defaultQueryParams;

        const searchQuery = {
            ...defaultQueryParams,
            searchQueryParams,
            searchMode: locale.components.searchComponent.advancedSearch.mode,
            activeFacets: {
                ...activeFacets,
                ...(this.state.advancedSearch.isOpenAccess ? {showOpenAccessOnly: true} : {})
            }
        };

        this.handleSearch(searchQuery);
    };

    render() {
        console.log('No results?', this.props.hasNoResults);
        console.log('Adv search state ', this.state.advancedSearch);
        return (
            <React.Fragment>
                {
                    (!this.state.isAdvancedSearch || this.props.isInHeader) &&
                    <SimpleSearchComponent
                        {...this.state.simpleSearch}
                        className={this.props.className}
                        isInHeader={this.props.isInHeader}
                        showSearchButton={this.props.showSearchButton}
                        showMobileSearchButton={this.props.showMobileSearchButton}
                        showAdvancedSearchButton={this.props.showAdvancedSearchButton}
                        showPrefixIcon={this.props.showPrefixIcon}
                        onToggleSearchMode={this._toggleSearchMode}
                        onSearchTextChange={this._handleSimpleSearchTextChange}
                        onSearch={this._handleSimpleSearch}
                        onInvalidSearch={this._displaySnackbar}
                    />
                }
                {
                    (this.state.isAdvancedSearch && !this.props.isInHeader) &&
                    <AdvancedSearchComponent
                        {...this.state.advancedSearch}
                        className={this.props.className}
                        onToggleSearchMode={this._toggleSearchMode}
                        onToggleMinimise={this._toggleMinimise}
                        onToggleOpenAccess={this._toggleOpenAccess}
                        onAdvancedSearchRowAdd={this._addAdvancedSearchRow}
                        onAdvancedSearchRowRemove={this._removeAdvancedSearchRow}
                        onAdvancedSearchReset={this._resetAdvancedSearch}
                        onAdvancedSearchRowChange={this._handleAdvancedSearchRowChange}
                        onSearch={this._handleAdvancedSearch}
                    />
                }
                <Snackbar
                    open={this.state.snackbarOpen}
                    autoHideDuration={5000}
                    message={this.state.snackbarMessage}
                />
            </React.Fragment>
        );
    }
}
