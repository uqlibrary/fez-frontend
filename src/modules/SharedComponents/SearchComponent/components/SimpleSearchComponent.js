import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';

import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {MAX_PUBLIC_SEARCH_TEXT_LENGTH} from 'config/general';
import {locale} from 'locale';

import {defaultQueryParams} from 'config/general';

export default class SearchComponent extends PureComponent {
    static propTypes = {
        searchQueryParams: PropTypes.object,
        isInHeader: PropTypes.bool,

        showSearchButton: PropTypes.bool,
        showMobileSearchButton: PropTypes.bool,
        showAdvancedSearchButton: PropTypes.bool,
        showPrefixIcon: PropTypes.bool,

        className: PropTypes.string,

        onSearch: PropTypes.func,
        onAdvancedSearchClick: PropTypes.func,
        onInvalidSearch: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: this.props.searchQueryParams && this.props.searchQueryParams.all || '',
            showMobile: false,
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

    searchTextChanged = (event, value) => {
        this.setState({
            ...this.state,
            searchText: value,
            snackbarOpen: false
        });
    };

    searchTextValidationMessage = (value) => {
        if (value.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            return locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH);
        }

        return null;
    };

    handleSimpleSearch = (event) => {
        if (event && event.key && (event.key !== 'Enter')) return;

        if (this.state.searchText.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            this.props.onInvalidSearch(locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH));
            return;
        }

        // Hide the mobile search bar after performing a search
        this.setState({
            ...this.state,
            showMobile: false
        });

        const searchQuery = {searchQueryParams: {all: this.state.searchText}, ...defaultQueryParams};

        // Perform search
        this.props.onSearch(searchQuery);

        // Blur the input so the mobile keyboard is deactivated
        event && event.target && event.target.blur();
    };

    render() {
        const txt = locale.components.searchComponent;

        return (
            <div className={`search-component ${this.props.isInHeader && 'header'} ${this.props.className}`}>
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
                                    floatingLabelText={!this.props.isInHeader && txt.searchBoxPlaceholder}
                                    hintText={this.props.isInHeader && txt.searchBoxPlaceholder}
                                    aria-label={txt.ariaInputLabel}
                                    onChange={this.searchTextChanged}
                                    onKeyPress={this.handleSimpleSearch}
                                    value={this.state.searchText}
                                    underlineStyle={this.props.isInHeader ? {display: 'none'} : {}}
                                    errorText={this.searchTextValidationMessage(this.state.searchText)}
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
                                onClick={this.handleSimpleSearch}
                                disabled={!!this.searchTextValidationMessage(this.state.searchText)}
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
                            disabled={!!this.searchTextValidationMessage(this.state.searchText)}
                            onClick={this.handleSimpleSearch}
                            fullWidth />
                    </div>
                    {
                        this.props.showAdvancedSearchButton &&
                        <div className="column is-narrow">
                            <RaisedButton
                                label={txt.advancedSearchButtonText}
                                aria-label={txt.advancedSearchButtonAriaLabel}
                                onClick={this.props.onAdvancedSearchClick}
                                className="advancedButton"
                                fullWidth
                            />
                        </div>
                    }
                </div>
            </div>
        );
    }
}
