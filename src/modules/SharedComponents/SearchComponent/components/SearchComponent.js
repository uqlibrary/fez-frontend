import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import param from 'can-param';

import Snackbar from '@material-ui/core/Snackbar';
import { routes } from 'config';
import {
    defaultQueryParams,
    UNPUBLISHED_STATUS_MAP,
    UNPUBLISHED_STATUS_TEXT_MAP,
    GENERIC_DATE_FORMAT
} from 'config/general';
import { locale } from 'locale';

import SimpleSearchComponent from './SimpleSearchComponent';
import AdvancedSearchComponent from './AdvancedSearchComponent';
import moment from 'moment';

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

        isAdmin: PropTypes.bool,
        isUnpublishedBufferPage: PropTypes.bool,

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
        isOpenAccessInAdvancedMode: false,
        updateFacetExcludesFromSearchFields: () => { }
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
                yearFilter: this.getYearRangeFromActiveFacets(props.activeFacets),
                ...this.getDateRangeFromSearchQuery(props.searchQueryParams)
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
                    searchText:
                        (nextProps.searchQueryParams.all || {}).value
                        || (typeof nextProps.searchQueryParams.all === 'string') &&
                        nextProps.searchQueryParams.all
                        || ''
                },
                advancedSearch: {
                    fieldRows: this.getFieldRowsFromSearchQuery(nextProps.searchQueryParams),
                    isMinimised: this.context.isMobile && nextProps.isAdvancedSearchMinimised || false,
                    isOpenAccess: nextProps.isOpenAccessInAdvancedMode || false,
                    docTypes: this.getDocTypesFromSearchQuery(nextProps.searchQueryParams),
                    yearFilter: {
                        from: this.state.advancedSearch.yearFilter.from,
                        to: this.state.advancedSearch.yearFilter.to,
                    },
                    ...this.getDateRangeFromSearchQuery(nextProps.searchQueryParams)
                }
            }, () => {
                // Update the excluded facets in SearchRecords to hide from facetFilter
                this.props.updateFacetExcludesFromSearchFields(
                    this.state.advancedSearch.fieldRows
                );
            });
        }
    }

    getFieldRowsFromSearchQuery = (searchQueryParams) => {
        const defaultFieldRow = {
            searchField: '0',
            value: '',
            label: ''
        };

        const fieldRows = !!searchQueryParams && Object.keys(searchQueryParams)
            .filter((item) => {
                return item !== 'rek_display_type';
            }) || [];

        if (fieldRows.length === 0) {
            return [defaultFieldRow];
        } else {
            const rows = fieldRows
                .map(key => {
                    switch (key) {
                        case 'rek_status':
                            return this.props.isAdmin &&
                                this.props.isUnpublishedBufferPage &&
                                {
                                    searchField: key,
                                    value: UNPUBLISHED_STATUS_TEXT_MAP[
                                        searchQueryParams[key].value
                                    ],
                                    label: ''
                                } ||
                                null
                            ;
                        case 'rek_created_date':
                        case 'rek_updated_date':
                            return this.props.isAdmin &&
                                this.props.isUnpublishedBufferPage &&
                                {
                                    searchField: key,
                                    value: searchQueryParams[key].hasOwnProperty('label')
                                        ? this.parseDateRange(searchQueryParams[key].label)
                                        : {},
                                    label: ''
                                } ||
                                null
                            ;
                        default:
                            return {
                                searchField: key,
                                value: searchQueryParams[key].hasOwnProperty('value')
                                    ? searchQueryParams[key].value
                                    : searchQueryParams[key],
                                label: searchQueryParams[key].hasOwnProperty('label')
                                    ? searchQueryParams[key].label
                                    : ''
                            };
                    }
                })
                .filter(item => !!item);
            return rows.length > 0 ? rows : [defaultFieldRow];
        }
    };

    getDateRangeFromSearchQuery = (searchQueryParams) => {
        const fieldRows = !!searchQueryParams && Object.keys(searchQueryParams);
        const keys = {
            rek_created_date: 'createdRange',
            rek_updated_date: 'updatedRange'
        };

        return fieldRows
            .filter(key => key === 'rek_created_date' || key === 'rek_updated_date')
            .reduce((ranges, key) => {
                ranges[[keys[key]]] = searchQueryParams[key].hasOwnProperty('label')
                    ? this.parseDateRange(searchQueryParams[key].label)
                    : {}
                ;
                return { ...ranges };
            }, {});
    };

    parseDateRange = (range) => {
        if (range.indexOf(' to ') < 1) {
            return {};
        }
        const parts = range.substring(1, range.length - 1).split(' to ');
        return {
            from: moment(parts[0], GENERIC_DATE_FORMAT),
            to: moment(parts[1], GENERIC_DATE_FORMAT)
        };
    };

    getDocTypesFromSearchQuery = (searchQueryParams) => {
        if (!searchQueryParams
            || !searchQueryParams.rek_display_type
            || searchQueryParams.rek_display_type.some(isNaN)
        ) {
            return [];
        } else {
            return searchQueryParams.rek_display_type.map(
                item => parseInt(item, 10)
            );
        }
    };

    getYearRangeFromActiveFacets = (activeFacets) => {
        if (activeFacets &&
            activeFacets.ranges &&
            activeFacets.ranges['Year published']
        ) {
            return {
                from: activeFacets.ranges['Year published'].from,
                to: activeFacets.ranges['Year published'].to };
        } else {
            return {};
        }
    };

    handleSearch = (searchQuery) => {
        if (searchQuery &&
            this.props.actions &&
            this.props.actions.searchEspacePublications
        ) {
            // If in header, the page will redirect to a new route,
            // which means search results from API call will be lost.
            !this.props.isInHeader &&
            this.props.actions.searchEspacePublications(searchQuery);

            // navigate to search results page
            this.props.history.push({
                pathname: (
                    this.props.isUnpublishedBufferPage
                        ? routes.pathConfig.admin.unpublished
                        : routes.pathConfig.records.search
                ),
                search: param(searchQuery),
                state: { ...searchQuery }
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
        const searchQuery = {
            searchQueryParams: {
                all: this.state.simpleSearch.searchText
            },
            ...defaultQueryParams
        };

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

    _updateDateRange = (field, dateRange) => {
        const { fieldRows } = this.state.advancedSearch;
        const index = fieldRows.findIndex(row => row.searchField === field);
        const captionIndex = index === -1 ? fieldRows.length : index;

        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                fieldRows: [
                    ...fieldRows.slice(0, captionIndex),
                    { searchField: field, value: dateRange, label: '' },
                    ...fieldRows.slice(captionIndex + 1)
                ]
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
        let ranges = {};
        const searchQueryParams = this.state.advancedSearch.fieldRows
            .filter(item => item.searchField !== '0')
            .reduce((searchQueries, item) => {
                const { searchField, ...rest } = item;
                if (searchField === 'rek_status' &&
                    !!item.value &&
                    this.props.isAdmin
                ) {
                    return {
                        ...searchQueries,
                        [searchField]: {
                            ...rest,
                            value: UNPUBLISHED_STATUS_MAP[item.value]
                        }
                    };
                } else if (this.props.isAdmin && (
                    searchField === 'rek_created_date'
                    || searchField === 'rek_updated_date'
                )) {
                    const rangeValue = `[${
                        item.value.from.utc().format()
                    } TO ${
                        item.value.to.endOf('day').utc().format()
                    }]`;
                    const rangeKeys = {
                        rek_created_date: 'Created date',
                        rek_updated_date: 'Updated date'
                    };
                    ranges = {
                        ...ranges,
                        [rangeKeys[searchField]]: rangeValue
                    };
                    return {
                        ...searchQueries,
                        [searchField]: {
                            ...rest,
                            label: `[${
                                item.value.from.format(GENERIC_DATE_FORMAT)
                            } to ${
                                item.value.to.format(GENERIC_DATE_FORMAT)
                            }]`,
                            value: rangeValue
                        }
                    };
                } else {
                    return { ...searchQueries, [searchField]: rest };
                }
            }, {});

        if (this.state.advancedSearch.yearFilter.from &&
            this.state.advancedSearch.yearFilter.to
        ) {
            ranges = {
                ...ranges,
                'Year published': {
                    from: this.state.advancedSearch.yearFilter.from,
                    to: this.state.advancedSearch.yearFilter.to
                }
            };
        }

        const searchQuery = this.getSearchQuery(searchQueryParams, ranges);
        this.handleSearch(searchQuery);
    };

    getSearchQuery = (searchQueryParams, ranges = {}) => {
        const { activeFacets } = defaultQueryParams;
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
                ranges: ranges,
                ...(this.state.advancedSearch.isOpenAccess
                    ? { showOpenAccessOnly: true }
                    : {}
                )
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
                        updateDateRange={this._updateDateRange}
                        onAdvancedSearchRowAdd={this._addAdvancedSearchRow}
                        onAdvancedSearchRowRemove={this._removeAdvancedSearchRow}
                        onAdvancedSearchReset={this._resetAdvancedSearch}
                        onAdvancedSearchRowChange={this._handleAdvancedSearchRowChange}
                        onSearch={this._handleAdvancedSearch}
                        showUnpublishedFields={this.props.isUnpublishedBufferPage && this.props.isAdmin}
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
