import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import param from 'can-param';

import Snackbar from '@mui/material/Snackbar';
import { pathConfig } from 'config';
import {
    DEFAULT_QUERY_PARAMS,
    GENERIC_DATE_FORMAT,
    UNPUBLISHED_STATUS_MAP,
    UNPUBLISHED_STATUS_TEXT_MAP,
} from 'config/general';
import { locale } from 'locale';

import SimpleSearchComponent from './SimpleSearchComponent';
import AdvancedSearchComponent from './AdvancedSearchComponent';
import moment from 'moment';
import hash from 'hash-sum';
import { withNavigate } from 'helpers/withNavigate';

export class SearchComponent extends PureComponent {
    static propTypes = {
        searchQueryParams: PropTypes.object,
        activeFacets: PropTypes.any,
        searchLoading: PropTypes.bool,

        isMobile: PropTypes.bool,
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

        navigate: PropTypes.func.isRequired,
        location: PropTypes.object,
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
    };

    constructor(props) {
        super(props);
        this.state = {
            snackbarOpen: false,
            snackbarMessage: '',
            isAdvancedSearch: props.isAdvancedSearch,
            simpleSearch: {
                searchText:
                    (!!props.searchQueryParams.all &&
                        !!props.searchQueryParams.all.value &&
                        props.searchQueryParams.all.value) ||
                    (typeof props.searchQueryParams.all === 'string' && props.searchQueryParams.all) ||
                    '',
            },
            advancedSearch: {
                fieldRows: this.getFieldRowsFromSearchQuery(props.searchQueryParams),
                isMinimised: props.isAdvancedSearchMinimised,
                isOpenAccess: props.isOpenAccessInAdvancedMode || false,
                docTypes: this.getDocTypesFromSearchQuery(props.searchQueryParams),
                yearFilter: this.getYearRangeFromActiveFacets(props.activeFacets),
                ...this.getDateRangeFromSearchQuery(props.searchQueryParams),
            },
            getFieldRowsFromSearchQuery: this.getFieldRowsFromSearchQuery,
            getDocTypesFromSearchQuery: this.getDocTypesFromSearchQuery,
            getDateRangeFromSearchQuery: this.getDateRangeFromSearchQuery,
            prevProps: {
                isOpenAccessInAdvancedMode: props.isOpenAccessInAdvancedMode,
                isAdvancedSearch: props.isAdvancedSearch,
            },
        };
    }

    static getDerivedStateFromProps(props, state) {
        const isOpenAccessInAdvancedModeChanged =
            props.isOpenAccessInAdvancedMode !== state.prevProps?.isOpenAccessInAdvancedMode;
        const isAdvancedSearchChanged = props.isAdvancedSearch !== state.prevProps?.isAdvancedSearch;
        const isAdvancedSearchMinimisedChanged =
            props.isMobile && props.isAdvancedSearchMinimised !== state.prevProps?.isAdvancedSearchMinimised;
        const searchQueryChanged =
            !state.prevProps?.searchQueryParams ||
            (props.searchQueryParams &&
                state.prevProps?.searchQueryParams &&
                hash(props.searchQueryParams) !== hash(state.prevProps?.searchQueryParams));

        if (
            !isOpenAccessInAdvancedModeChanged &&
            !isAdvancedSearchChanged &&
            !isAdvancedSearchMinimisedChanged &&
            !searchQueryChanged
        ) {
            return null;
        }

        let newState = {
            ...state,
            ...(isAdvancedSearchChanged ? { isAdvancedSearch: props.isAdvancedSearch } : {}),
            advancedSearch: {
                ...state.advancedSearch,
                ...(isOpenAccessInAdvancedModeChanged ? { isOpenAccess: props.isOpenAccessInAdvancedMode } : {}),
                ...(isAdvancedSearchMinimisedChanged ? { isMinimised: props.isAdvancedSearchMinimised } : {}),
            },
        };

        if (searchQueryChanged) {
            newState = {
                ...newState,
                simpleSearch: {
                    ...newState.simpleSearch,
                    searchText:
                        /* c8 ignore next */
                        props.searchQueryParams?.all?.value ||
                        (typeof props.searchQueryParams?.all === 'string' && props.searchQueryParams?.all) ||
                        '',
                },
                advancedSearch: {
                    ...newState.advancedSearch,
                    fieldRows: state.getFieldRowsFromSearchQuery(props.searchQueryParams),
                    docTypes: state.getDocTypesFromSearchQuery(props.searchQueryParams),
                    yearFilter: {
                        from: state.advancedSearch.yearFilter.from,
                        to: state.advancedSearch.yearFilter.to,
                    },
                    ...state.getDateRangeFromSearchQuery(props.searchQueryParams),
                },
            };
        }

        return { ...newState, prevProps: { ...props } };
    }

    getFieldRowsFromSearchQuery = searchQueryParams => {
        const defaultFieldRow = {
            searchField: '0',
            value: '',
            label: '',
        };

        const fieldRows =
            (!!searchQueryParams &&
                Object.keys(searchQueryParams).filter(item => {
                    return item !== 'rek_display_type';
                })) ||
            /* c8 ignore next */ [];

        if (fieldRows.length === 0) {
            return [defaultFieldRow];
        } else {
            const rows = fieldRows
                .map(key => {
                    switch (key) {
                        case 'rek_status':
                            return (
                                (this.props.isAdmin &&
                                    this.props.isUnpublishedBufferPage && {
                                        searchField: key,
                                        value: UNPUBLISHED_STATUS_TEXT_MAP[searchQueryParams[key].value],
                                        label: '',
                                    }) ||
                                null
                            );
                        case 'rek_created_date':
                        case 'rek_updated_date':
                            return (
                                (this.props.isAdmin &&
                                    this.props.isUnpublishedBufferPage && {
                                        searchField: key,
                                        value: searchQueryParams[key].hasOwnProperty('label')
                                            ? this.parseDateRange(searchQueryParams[key].label)
                                            : {},
                                        label: '',
                                    }) ||
                                null
                            );
                        default:
                            return {
                                searchField: key,
                                value: searchQueryParams[key].hasOwnProperty('value')
                                    ? searchQueryParams[key].value
                                    : searchQueryParams[key],
                                label: searchQueryParams[key].hasOwnProperty('label')
                                    ? searchQueryParams[key].label
                                    : '',
                            };
                    }
                })
                .filter(item => !!item);
            return rows.length > 0 ? rows : [defaultFieldRow];
        }
    };

    getDateRangeFromSearchQuery = searchQueryParams => {
        const fieldRows = !!searchQueryParams && Object.keys(searchQueryParams);
        const keys = {
            rek_created_date: 'createdRange',
            rek_updated_date: 'updatedRange',
        };

        return fieldRows
            .filter(key => key === 'rek_created_date' || key === 'rek_updated_date')
            .reduce((ranges, key) => {
                ranges[[keys[key]]] = searchQueryParams[key].hasOwnProperty('label')
                    ? this.parseDateRange(searchQueryParams[key].label)
                    : {};
                return { ...ranges };
            }, {});
    };

    parseDateRange = range => {
        /* c8 ignore next */
        if (range.indexOf(' to ') < 1) {
            return {};
        }
        const parts = range.substring(1, range.length - 1).split(' to ');
        return {
            from: moment(parts[0], GENERIC_DATE_FORMAT),
            to: moment(parts[1], GENERIC_DATE_FORMAT),
        };
    };

    getDocTypesFromSearchQuery = searchQueryParams => {
        if (
            !searchQueryParams ||
            !searchQueryParams.rek_display_type ||
            searchQueryParams.rek_display_type.some(isNaN)
        ) {
            return [];
        } else {
            return searchQueryParams.rek_display_type.map(item => parseInt(item, 10));
        }
    };

    getYearRangeFromActiveFacets = activeFacets => {
        if (activeFacets && activeFacets.ranges && activeFacets.ranges['Year published']) {
            return {
                from: activeFacets.ranges['Year published'].from,
                to: activeFacets.ranges['Year published'].to,
            };
        } else {
            return {};
        }
    };

    handleSearch = searchQuery => {
        /* c8 ignore next */
        if (!searchQuery) {
            return;
        }

        this.props.navigate({
            pathname: this.props.isUnpublishedBufferPage ? pathConfig.admin.unpublished : pathConfig.records.search,
            search: param(searchQuery),
        });
    };

    _toggleSearchMode = () => {
        this.setState({
            isAdvancedSearch: !this.state.isAdvancedSearch,
            advancedSearch: {
                ...this.state.advancedSearch,
                isMinimised: false,
            },
        });
    };

    /*
     *  ==============================
     *  Simple search handlers
     *  ==============================
     */
    _handleSimpleSearchTextChange = value => {
        this.setState({
            simpleSearch: {
                searchText: value,
            },
            snackbarOpen: false,
        });
    };

    _handleSimpleSearch = () => {
        const searchQuery = {
            searchQueryParams: {
                all: this.state.simpleSearch.searchText,
            },
            ...DEFAULT_QUERY_PARAMS,
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
                isMinimised: !this.state.advancedSearch.isMinimised,
            },
        });
    };

    _toggleOpenAccess = () => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                isOpenAccess: !this.state.advancedSearch.isOpenAccess,
            },
        });
    };

    _updateDocTypeValues = docTypeValues => {
        // Update the state with new values
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                docTypes: docTypeValues,
            },
        });
    };

    _updateYearRangeFilter = yearRange => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                yearFilter: yearRange,
            },
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
                    ...fieldRows.slice(captionIndex + 1),
                ],
            },
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
                    },
                ],
            },
        });
    };

    _removeAdvancedSearchRow = index => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                fieldRows: [
                    ...this.state.advancedSearch.fieldRows.slice(0, index),
                    ...this.state.advancedSearch.fieldRows.slice(index + 1),
                ],
            },
        });
    };

    _resetAdvancedSearch = () => {
        this.setState({
            advancedSearch: {
                isOpenAccess: false,
                docTypes: [],
                yearFilter: {
                    from: 0,
                    to: 0,
                },
                fieldRows: [
                    {
                        searchField: '0',
                        value: '',
                    },
                ],
            },
        });
    };

    _handleAdvancedSearchRowChange = (index, searchRow) => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                fieldRows: [
                    ...this.state.advancedSearch.fieldRows.slice(0, index),
                    searchRow,
                    ...this.state.advancedSearch.fieldRows.slice(index + 1),
                ],
            },
        });
    };

    _handleAdvancedSearch = () => {
        let ranges = {};
        const searchQueryParams = this.state.advancedSearch.fieldRows
            .filter(item => item.searchField !== '0')
            .reduce((searchQueries, item) => {
                const { searchField, ...rest } = item;
                if (searchField === 'rek_status' && !!item.value && this.props.isAdmin) {
                    return {
                        ...searchQueries,
                        [searchField]: {
                            ...rest,
                            value: UNPUBLISHED_STATUS_MAP[item.value],
                        },
                    };
                } else if (
                    this.props.isAdmin &&
                    (searchField === 'rek_created_date' || searchField === 'rek_updated_date')
                ) {
                    const rangeValue = `[${item.value.from.utc().format()} TO ${item.value.to
                        .endOf('day')
                        .utc()
                        .format()}]`;
                    const rangeKeys = {
                        rek_created_date: 'Created date',
                        rek_updated_date: 'Updated date',
                    };
                    ranges = {
                        ...ranges,
                        [rangeKeys[searchField]]: rangeValue,
                    };
                    return {
                        ...searchQueries,
                        [searchField]: {
                            ...rest,
                            label: `[${item.value.from.format(GENERIC_DATE_FORMAT)} to ${item.value.to.format(
                                GENERIC_DATE_FORMAT,
                            )}]`,
                            value: rangeValue,
                        },
                    };
                } else {
                    return { ...searchQueries, [searchField]: rest };
                }
            }, {});

        if (this.state.advancedSearch.yearFilter.from && this.state.advancedSearch.yearFilter.to) {
            ranges = {
                ...ranges,
                'Year published': {
                    from: this.state.advancedSearch.yearFilter.from,
                    to: this.state.advancedSearch.yearFilter.to,
                },
            };
        }

        const searchQuery = this.getSearchQuery(searchQueryParams, ranges);
        this.handleSearch(searchQuery);
    };

    getSearchQuery = (searchQueryParams, ranges) => {
        const { activeFacets } = DEFAULT_QUERY_PARAMS;
        const docTypeParams = this.state.advancedSearch.docTypes;

        const searchQuery = {
            ...DEFAULT_QUERY_PARAMS,
            searchQueryParams: {
                ...searchQueryParams,
                rek_display_type: docTypeParams,
            },
            searchMode: locale.components.searchComponent.advancedSearch.mode,
            activeFacets: {
                ...activeFacets,
                ranges: ranges,
                ...(this.state.advancedSearch.isOpenAccess ? { showOpenAccessOnly: true } : {}),
            },
        };
        return searchQuery;
    };

    render() {
        return (
            <React.Fragment>
                {(!this.state.isAdvancedSearch || this.props.isInHeader) && (
                    <SimpleSearchComponent
                        autoFocus={this.props.autoFocus}
                        {...this.state.simpleSearch}
                        isInHeader={this.props.isInHeader}
                        showSearchButton={this.props.showSearchButton}
                        showMobileSearchButton={this.props.showMobileSearchButton}
                        showAdvancedSearchButton={this.props.showAdvancedSearchButton}
                        showPrefixIcon={this.props.showPrefixIcon}
                        onToggleSearchMode={this._toggleSearchMode}
                        onSearchTextChange={this._handleSimpleSearchTextChange}
                        onSearch={this._handleSimpleSearch}
                    />
                )}
                {this.state.isAdvancedSearch && !this.props.isInHeader && (
                    <AdvancedSearchComponent
                        {...this.state.advancedSearch}
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
                )}
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

export default withNavigate()(SearchComponent);
