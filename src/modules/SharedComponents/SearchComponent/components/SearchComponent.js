import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import CircularProgress from 'material-ui/CircularProgress';
import AdvancedSearchRow from './AdvancedSearchRow';
import Checkbox from 'material-ui/Checkbox';
import param from 'can-param';

import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Snackbar from 'material-ui/Snackbar';
import {MAX_PUBLIC_SEARCH_TEXT_LENGTH} from 'config/general';
import {routes} from 'config';
import {locale} from 'locale';


export default class SearchComponent extends PureComponent {
    static propTypes = {
        searchQueryParams: PropTypes.object,
        inHeader: PropTypes.bool,
        isLoading: PropTypes.bool,
        showAdvancedSearchButton: PropTypes.bool,
        showAdvancedSearch: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showPrefixIcon: PropTypes.bool,
        showMobileSearchButton: PropTypes.bool,
        className: PropTypes.string,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: this.props.searchQueryParams && this.props.searchQueryParams.all || '',
            showAdvancedSearch: this.props.showAdvancedSearch || false,
            showMobile: false,
            snackbarOpen: false,
            snackbarMessage: '',
            advancedSearch: {
                minimised: false,
                openAccess: false,
                fieldRows: [
                    {
                        searchField: 1,
                        value: this.props.searchQueryParams && this.props.searchQueryParams.all || '',
                    }
                ]
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.searchQueryParams && !!nextProps.searchQueryParams.all
            && nextProps.searchQueryParams.all !== this.state.searchText) {
            this.setState({
                ...this.state,
                searchText: nextProps.searchQueryParams.all || ''
            });
        }
    }

    handleSearch = (event) => {
        // Stop submission unless enter was pressed
        if (event && event.key && (event.key !== 'Enter')) return;

        // Snackbar for to give feedback when input is too short or long in the header search when pressing enter
        if (this.props.inHeader
            && this.state.searchText.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            this.setState({
                ...this.state,
                snackbarMessage: locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH),
                snackbarOpen: true
            });
            return;
        }

        // If all is OK, submit the search
        if (this.props.actions
            && this.props.actions.searchEspacePublications
            && this.state.searchText.trim().length <= MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            // If advanced search is maximised, then minimise it
            if(!this.state.advancedSearch.minimised && this.state.showAdvancedSearch) {
                this.toggleAdvancedSearchMinimise();
            }
            // start search
            const defaultQueryParams = {
                page: 1,
                pageSize: 20,
                sortBy: locale.components.sorting.sortBy[0].value,
                sortDirection: locale.components.sorting.sortDirection[0],
                activeFacets: {filters: {}, ranges: {}}
            };

            const searchQuery = {searchQueryParams: {all: this.state.searchText}, ...defaultQueryParams};
            this.props.actions.searchEspacePublications(searchQuery);

            // Hide the mobile search bar after performing a search
            this.setState({
                ...this.state,
                showMobile: false
            });
            // Blur the input so the mobile keyboard is deactivated
            event && event.target && event.target.blur();

            // navigate to search results page
            this.props.history.push({
                pathname: routes.pathConfig.records.search,
                search: param(searchQuery),
                state: {...searchQuery}
            });
        }
    };

    toggleMobile = () => {
        this.setState({
            ...this.state,
            showMobile: !this.state.showMobile,
            snackbarOpen: false
        }, () => {
            if(this.state.showMobile) {
                document.getElementById('searchField') && document.getElementById('searchField').focus();
            }
        });
    };

    toggleAdvancedSearchMinimise = () => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                minimised: !this.state.advancedSearch.minimised
            }
        });
    };

    searchTextChanged = (event, value) => {
        this.setState({
            ...this.state,
            searchText: value,
            snackbarOpen: false
        });
    };

    toggleAdvancedSearch = () => {
        this.setState({
            ...this.state,
            showAdvancedSearch: !this.state.showAdvancedSearch
        });
    };

    searchTextValidation = (value = this.state.searchText) => {
        if (!this.props.inHeader && value.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            return locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH);
        } else {
            return false;
        }
    };

    addAdvancedField = () => {
        const thisIndex = this.state.advancedSearch.fieldRows.length - 1;
        if(this.state.advancedSearch.fieldRows[thisIndex].value) {
            const newArray = [
                ...this.state.advancedSearch.fieldRows,
                {
                    searchField: 0,
                    value: '',
                }
            ];
            this.setState({
                advancedSearch: {
                    ...this.state.advancedSearch,
                    fieldRows: newArray
                }
            });
        }
    };

    deleteAdvancedField = (index) => {
        const newArray = [
            ...this.state.advancedSearch.fieldRows.slice(0, index),
            ...this.state.advancedSearch.fieldRows.slice(index + 1)
        ];
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                fieldRows: newArray
            }
        });
    };

    updateAdvancedField = (index, {value, searchField}) => {
        const newArray = [
            ...this.state.advancedSearch.fieldRows.slice(0, index),
            {
                searchField,
                value,
            },
            ...this.state.advancedSearch.fieldRows.slice(index + 1)
        ];
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                fieldRows: newArray
            }
        });
    };

    resetAdvancedFields = () => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                openAccess: false,
                fieldRows: [
                    {
                        fieldIndex: 0,
                        searchField: 0,
                        value: ''
                    }
                ]
            }
        });
    };

    toggleOpenAccess = () => {
        this.setState({
            advancedSearch: {
                ...this.state.advancedSearch,
                openAccess: !this.state.advancedSearch.openAccess
            }
        });
    };

    usedFieldsArray = () => {
        const newArray = [0];
        this.state.advancedSearch.fieldRows.some((obj) => {
            newArray.push(obj.searchField);
        });
        return newArray.sort();
    };

    render() {
        const txt = locale.components.searchComponent;
        const canAddAnotherField = this.state.advancedSearch.fieldRows[this.state.advancedSearch.fieldRows.length - 1]
            && this.state.advancedSearch.fieldRows[this.state.advancedSearch.fieldRows.length - 1].value
            && this.usedFieldsArray().length < txt.advancedSearch.fieldTypes.length;
        const advancedSearchCaption = () => {
            const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
            const searchFields = this.state.advancedSearch.fieldRows.map((item, index) => (
                <span key={index}>
                    {index > 0 && <span className="and">  {item.value && 'and'}</span>}
                    <span className={`title ${index > 0 && ' lowercase'}`}> {item.value && txt[item.searchField].title}</span>
                    <span className="combiner"> {item.value && txt[item.searchField].combiner}</span>
                    <span className="value"> {item.value}</span>
                </span>
            ));
            const openAccess = this.state.advancedSearch.openAccess
                ? <span> and is <span className="value">open access/ full text.</span></span>
                : '.';
            return <div>{searchFields}{openAccess}</div>;
        };
        return (
            <div className={`search-component ${this.props.inHeader && 'header'} ${this.props.className}`}>
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
                                    this.props.showMobileSearchButton &&
                                    <div className="column is-narrow search-icon-prefix is-hidden-tablet">
                                        <IconButton
                                            onClick={this.toggleMobile}
                                            className="mobileBackArrow" >
                                            <ArrowBack/>
                                        </IconButton>
                                    </div>
                                }
                                <div className="column">
                                    <TextField
                                        type="search"
                                        id="searchField"
                                        fullWidth
                                        floatingLabelText={!this.props.inHeader && txt.searchBoxPlaceholder}
                                        hintText={this.props.inHeader && txt.searchBoxPlaceholder}
                                        aria-label={txt.ariaInputLabel}
                                        onChange={this.searchTextChanged}
                                        onKeyPress={this.handleSearch}
                                        value={this.state.searchText}
                                        underlineStyle={this.props.inHeader ? {display: 'none'} : {}}
                                        errorText={this.searchTextValidation(this.state.searchText)}
                                    />
                                </div>
                                <div className="is-hidden-tablet mobileSpacer" />
                            </div>
                        </div>
                        {
                            this.props.showMobileSearchButton &&
                            <div className="column is-narrow is-hidden-tablet">
                                <IconButton
                                    onClick={this.toggleMobile}
                                    aria-label={txt.mobileSearchButtonAriaLabel}
                                    className="search-button"
                                    hoveredStyle={{backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%'}}
                                >
                                    <SearchIcon/>
                                </IconButton>
                            </div>
                        }
                        {
                            this.props.showSearchButton &&
                            <div className="column is-narrow icon-search-button-wrapper">
                                <IconButton
                                    tooltipPosition="bottom-left"
                                    onClick={this.handleSearch}
                                    disabled={!!this.searchTextValidation(this.state.searchText)}
                                    className="search-button"
                                    tooltip={txt.searchButtonHint}
                                    aria-label={txt.searchButtonAriaLabel}>
                                    <SearchIcon/>
                                </IconButton>
                            </div>
                        }
                        <div className="column is-narrow search-button-wrapper">
                            <RaisedButton
                                label={txt.searchButtonText}
                                aria-label={txt.searchButtonAriaLabel}
                                primary
                                disabled={!!this.searchTextValidation(this.state.searchText)}
                                onClick={this.handleSearch}
                                fullWidth />
                        </div>
                        {
                            this.props.showAdvancedSearchButton &&
                            <div className="column is-narrow">
                                <RaisedButton
                                    label={txt.advancedSearchButtonText}
                                    aria-label={txt.advancedSearchButtonAriaLabel}
                                    onClick={this.toggleAdvancedSearch}
                                    className="advancedButton"
                                    fullWidth
                                />
                            </div>
                        }
                    </div>
                }
                {/* ADVANCED SEARCH */}
                {
                    this.state.showAdvancedSearch && this.props.showAdvancedSearchButton &&
                        <div className="advancedSearch">
                            <div className="columns is-gapless is-mobile" style={{marginBottom: '-12px'}}>
                                <div className="column">
                                    <h2>{txt.advancedSearch.title}</h2>
                                </div>
                                {
                                    this.props.isLoading &&
                                    <div className="column is-narrow">
                                        <CircularProgress size={32} thickness={4} className="loadingProgress" />
                                    </div>
                                }
                                <div className="column is-narrow">
                                    <IconButton onClick={this.toggleAdvancedSearchMinimise}
                                        tooltip={this.state.advancedSearch.minimised
                                            ? txt.advancedSearch.tooltip.show
                                            : txt.advancedSearch.tooltip.hide}>
                                        {
                                            !this.state.advancedSearch.minimised
                                                ? <KeyboardArrowUp/>
                                                : <KeyboardArrowDown/>
                                        }
                                    </IconButton>
                                </div>
                            </div>
                            {
                                !this.state.advancedSearch.minimised &&
                                    <div>
                                        <div className="columns">
                                            <div className="column fields">
                                                {
                                                    this.state.advancedSearch.fieldRows.map((item, index) => (
                                                        <AdvancedSearchRow
                                                            key={index}
                                                            updateValueFunc={this.updateAdvancedField}
                                                            deleteFunc={this.deleteAdvancedField}
                                                            fieldIndex={index}
                                                            searchField={item.searchField}
                                                            value={item.value}
                                                            errorText={this.searchTextValidation.bind()}
                                                            disabledFields={this.usedFieldsArray()}
                                                        />
                                                    ))
                                                }
                                            </div>
                                            <div className="column is-3">
                                                <Checkbox
                                                    label={txt.advancedSearch.openAccess.title}
                                                    checked={this.state.advancedSearch.openAccess}
                                                    onCheck={this.toggleOpenAccess}
                                                    style={{marginTop: 12, paddingBottom: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)'}}
                                                />
                                            </div>
                                        </div>
                                        <div className="columns is-gapless">
                                            <div className="column is-narrow">
                                                <RaisedButton
                                                    label={txt.advancedSearch.addField.title}
                                                    aria-label={txt.advancedSearch.addField.aria}
                                                    secondary
                                                    disabled={!canAddAnotherField}
                                                    onClick={this.addAdvancedField}
                                                />
                                            </div>
                                            <div className="column is-narrow">
                                                <RaisedButton
                                                    label={txt.advancedSearch.reset.title}
                                                    aria-label={txt.advancedSearch.reset.aria}
                                                    style={{marginLeft: 6}}
                                                    onClick={this.resetAdvancedFields}
                                                />
                                            </div>
                                            <div className="column is-narrow">
                                                <FlatButton
                                                    label={txt.advancedSearch.simpleSearch.title}
                                                    aria-label={txt.advancedSearch.simpleSearch.aria}
                                                    style={{marginLeft: 6}}
                                                    onClick={this.toggleAdvancedSearch}
                                                />
                                            </div>
                                            <div className="column" />
                                            <div className="column is-3">
                                                <RaisedButton
                                                    label={txt.searchButtonText}
                                                    aria-label={txt.searchButtonAriaLabel}
                                                    primary
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                    </div>
                            }
                            <div className="searchQueryCaption">
                                {advancedSearchCaption()}
                            </div>
                        </div>
                }
                <Snackbar
                    open={this.state.snackbarOpen}
                    autoHideDuration={5000}
                    message={this.state.snackbarMessage}
                />
            </div>
        );
    }
}
