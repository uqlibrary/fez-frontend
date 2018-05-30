import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
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
            searchText: props.searchQueryParams && props.searchQueryParams.all || '',
            showAdvancedSearch: props.showAdvancedSearch || false,
            showMobile: false,
            snackbarOpen: false,
            snackbarMessage: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.searchQueryParams && !!nextProps.searchQueryParams.all
            && nextProps.searchQueryParams.all !== this.state.searchText) {
            this.setState({
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
                snackbarMessage: locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH),
                snackbarOpen: true
            });
            return;
        }

        // If all is OK, submit the search
        if (this.props.actions
            && this.props.actions.searchEspacePublications
            && this.state.searchText.trim().length <= MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
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
            this.setState({showMobile: false});
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
            showMobile: !this.state.showMobile,
            snackbarOpen: false
        }, () => {
            if(this.state.showMobile) {
                document.getElementById('searchField') && document.getElementById('searchField').focus();
            }
        });
    };

    searchTextChanged = (event, value) => {
        this.setState({
            searchText: value,
            snackbarOpen: false
        });
    };

    toggleAdvancedSearch = () => {
        this.setState({
            showAdvancedSearch: !this.state.showAdvancedSearch
        });
    };

    validationError = () => {
        if (!this.props.inHeader && this.state.searchText.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            return locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH);
        } else {
            return false;
        }
    };

    render() {
        const txt = locale.components.searchComponent;
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
                                        errorText={this.validationError()}
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
                                    disabled={!!this.validationError}
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
                                secondary
                                disabled={!!this.validationError()}
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
                {
                    this.state.showAdvancedSearch && this.props.showAdvancedSearchButton &&
                    <div className="columns">
                        <div className="column">
                            Advanced here.
                        </div>
                        <div className="column is-narrow">
                            <RaisedButton
                                label={txt.simpleSearchToggle}
                                onClick={this.toggleAdvancedSearch}/>
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
