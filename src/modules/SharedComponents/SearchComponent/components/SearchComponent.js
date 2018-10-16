import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import param from 'can-param';

import Snackbar from '@material-ui/core/Snackbar';
import {routes} from 'config';
import {defaultQueryParams} from 'config/general';
import {locale} from 'locale';

import SimpleSearchComponent from './SimpleSearchComponent';
import AdvancedSearchComponent from './AdvancedSearchComponent';

export default class SearchComponent extends PureComponent {
    static propTypes = {
        searchQueryParams: PropTypes.object,
        activeFacets: PropTypes.any,
        facetsChanged: PropTypes.func,
        updateFacetExcludesFromSearchFields: PropTypes.func,
        searchLoading: PropTypes.bool,

        showSearchButton: PropTypes.bool,
        showMobileSearchButton: PropTypes.bool,
        showAdvancedSearchButton: PropTypes.bool,
        showPrefixIcon: PropTypes.bool,

        isInHeader: PropTypes.bool,
        isAdvancedSearch: PropTypes.bool,
        isAdvancedSearchMinimised: PropTypes.bool,
        isOpenAccessInAdvancedMode: PropTypes.bool,
        autoFocus: PropTypes.bool,

        className: PropTypes.string,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired,
        location: PropTypes.object
    };

    static contextTypes = {
        isMobile: PropTypes.bool
    };

    static defaultProps = {
        searchQueryParams: {},

        showSearchButton: false,
        showMobileSearchButton: false,
        showAdvancedSearchButton: false,
        showPrefixIcon: false,

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
                searchText: (
                    !!props.searchQueryParams.all
                    && !!props.searchQueryParams.all.value
                    && props.searchQueryParams.all.value
                ) || props.searchQueryParams.all || ''
            },
            advancedSearch: {
                fieldRows: this.getFieldRowsFromSearchQuery(props.searchQueryParams),
                isMinimised: props.isAdvancedSearchMinimised,
                isOpenAccess: props.isOpenAccessInAdvancedMode || false,
                docTypes: this.getDocTypesFromSearchQuery(props.searchQueryParams),
                yearFilter: this.getYearRangeFromActiveFacets(props.activeFacets) || {}
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        if (
            Object.keys(nextProps.searchQueryParams).length !== Object.keys(this.props.searchQueryParams).length ||
            nextProps.isAdvancedSearchMinimised !== this.props.isAdvancedSearchMinimised
        ) {
            this.setState({
                isAdvancedSearch: nextProps.isAdvancedSearch,
                simpleSearch: {
                    searchText: (
                        !!nextProps.searchQueryParams.all
                        && !!nextProps.searchQueryParams.all.value
                        && nextProps.searchQueryParams.all.value
                    )
                    || (typeof nextProps.searchQueryParams.all === 'string') && nextProps.searchQueryParams.all
                    || ''
                },
                advancedSearch: {
                    fieldRows: this.getFieldRowsFromSearchQuery(nextProps.searchQueryParams),
                    isMinimised: this.context.isMobile && nextProps.isAdvancedSearchMinimised || false,
                    isOpenAccess: nextProps.isOpenAccessInAdvancedMode || false,
                    docTypes: this.getDocTypesFromSearchQuery(nextProps.searchQueryParams) || [],
                    yearFilter: {
                        from: this.state.advancedSearch.yearFilter.from,
                        to: this.state.advancedSearch.yearFilter.to,
                    }
                }
            }, () => {
                // Update the excluded facets in SearchRecords to hide from facetFilter
                this.props.updateFacetExcludesFromSearchFields(this.state.advancedSearch.fieldRows);
            });
        }
    }

    getFieldRowsFromSearchQuery = (searchQueryParams) => {
        const fieldRows = !!searchQueryParams && Object.keys(searchQueryParams)
            .filter((item) => {
                return item !== 'rek_display_type';
            }) || [];

        if (fieldRows.length === 0) {
            return [{
                searchField: '0',
                value: '',
                label: ''
            }];
        } else {
            return fieldRows
                .map(key => ({
                    searchField: key,
                    value: searchQueryParams[key].hasOwnProperty('value') ? searchQueryParams[key].value : searchQueryParams[key],
                    label: searchQueryParams[key].hasOwnProperty('label') ? searchQueryParams[key].label : ''
                }));
        }
    };

    getDocTypesFromSearchQuery = (searchQueryParams) => {
        if (!searchQueryParams
            || !searchQueryParams.rek_display_type
            || searchQueryParams.rek_display_type.some(isNaN)) {
            return [];
        } else {
            return searchQueryParams.rek_display_type.map(item => parseInt(item, 10));
        }
    };

    getYearRangeFromActiveFacets = (activeFacets) => {
        if(activeFacets && activeFacets.ranges && activeFacets.ranges['Year published']) {
            return {from: activeFacets.ranges['Year published'].from, to: activeFacets.ranges['Year published'].to};
        } else {
            return {};
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

    _updateDocTypeValues = (docTypeValues) => {
        // Update the state with new values
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                docTypes: docTypeValues
            }
        });
    };

    _updateYearRangeFilter = (yearRange) => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                yearFilter: yearRange
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
                docTypes: [],
                yearFilter: {
                    from: 0,
                    to: 0
                },
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
            .filter(item => item.searchField !== '0')
            .reduce((searchQueries, item) => {
                const {searchField, ...rest} = item;
                return {...searchQueries, [searchField]: rest};
            }, {});
        const searchQuery = this.getSearchQuery(searchQueryParams);
        this.handleSearch(searchQuery);
    };

    getSearchQuery = (searchQueryParams) => {
        const {activeFacets} = defaultQueryParams;
        const docTypeParams = this.state.advancedSearch.docTypes;

        const searchQuery = {
            ...defaultQueryParams,
            searchQueryParams: {
                ...searchQueryParams,
                rek_display_type: docTypeParams
            },
            searchMode: locale.components.searchComponent.advancedSearch.mode,
            activeFacets: {
                ...activeFacets,
                ranges: this.state.advancedSearch.yearFilter.from && this.state.advancedSearch.yearFilter.to
                    ? {'Year published': {
                        from: this.state.advancedSearch.yearFilter.from,
                        to: this.state.advancedSearch.yearFilter.to
                    }}
                    : {},
                ...(this.state.advancedSearch.isOpenAccess ? {showOpenAccessOnly: true} : {})
            }
        };
        return searchQuery;
    };

    render() {
        return (
            <React.Fragment>
                {
                    (!this.state.isAdvancedSearch || this.props.isInHeader) &&
                    <SimpleSearchComponent
                        autoFocus={this.props.autoFocus}
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
                        updateDocTypeValues={this._updateDocTypeValues}
                        updateYearRangeFilter={this._updateYearRangeFilter}
                        onAdvancedSearchRowAdd={this._addAdvancedSearchRow}
                        onAdvancedSearchRowRemove={this._removeAdvancedSearchRow}
                        onAdvancedSearchReset={this._resetAdvancedSearch}
                        onAdvancedSearchRowChange={this._handleAdvancedSearchRowChange}
                        onSearch={this._handleAdvancedSearch}
                        isLoading={this.props.searchLoading}
                    />
                }
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackbarOpen}
                    autoHideDuration={5000}
                    message={this.state.snackbarMessage}
                />
            </React.Fragment>
        );
    }
}
