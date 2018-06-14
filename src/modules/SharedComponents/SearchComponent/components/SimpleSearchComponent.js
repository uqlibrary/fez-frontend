import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';

import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {MAX_PUBLIC_SEARCH_TEXT_LENGTH} from 'config/general';
import {locale} from 'locale';

export default class SimpleSearchComponent extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        searchText: PropTypes.string,

        isInHeader: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showMobileSearchButton: PropTypes.bool,
        showAdvancedSearchButton: PropTypes.bool,
        showPrefixIcon: PropTypes.bool,

        onSearch: PropTypes.func,
        onSearchTextChange: PropTypes.func.isRequired,
        onToggleSearchMode: PropTypes.func,
        onInvalidSearch: PropTypes.func
    };

    static defaultProps = {
        searchText: '',

        isInHeader: false,
        showSearchButton: false,
        showMobileSearchButton: false,
        showAdvancedSearchButton: false,
        showPrefixIcon: false,

        onSearch: () => {},
        onToggleSearchMode: () => {},
        onInvalidSearch: () => {}
    };

    constructor(props) {
        super(props);
        this.state = {
            showMobile: false
        };
    }

    searchTextValidationMessage = (value) => {
        if (value.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            return locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH);
        }

        return null;
    };

    _handleToggleMobile = () => {
        this.setState({
            ...this.state,
            showMobile: !this.state.showMobile
        }, () => {
            if(this.state.showMobile) {
                document.getElementById('searchField') && document.getElementById('searchField').focus();
            }
        });
    };

    _handleSearchTextChange = (event, value) => {
        this.props.onSearchTextChange(value);
    };

    _handleSearchMode = () => {
        if (!!this.props.onToggleSearchMode) {
            this.props.onToggleSearchMode();
        }
    };

    _handleSearch = (event) => {
        if (event && event.key && (event.key !== 'Enter')) return;

        if (this.props.searchText.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            this.props.onInvalidSearch(locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH));
            return;
        }

        // Hide the mobile search bar after performing a search
        this.setState({
            ...this.state,
            showMobile: false
        });

        // Perform search
        this.props.onSearch();

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
                                        onClick={this._handleToggleMobile}
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
                                    onChange={this._handleSearchTextChange}
                                    onKeyPress={this._handleSearch}
                                    value={this.props.searchText}
                                    underlineStyle={this.props.isInHeader ? {display: 'none'} : {}}
                                    errorText={this.searchTextValidationMessage(this.props.searchText)}
                                />
                            </div>
                            <div className="is-hidden-tablet mobileSpacer" />
                        </div>
                    </div>
                    {
                        this.props.showMobileSearchButton &&
                        <div className="column is-narrow is-hidden-tablet">
                            <IconButton
                                onClick={this._handleToggleMobile}
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
                                onClick={this._handleSearch}
                                disabled={!!this.searchTextValidationMessage(this.props.searchText)}
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
                            disabled={!!this.searchTextValidationMessage(this.props.searchText)}
                            onClick={this._handleSearch}
                            fullWidth />
                    </div>
                    {
                        this.props.showAdvancedSearchButton &&
                        <div className="column is-narrow">
                            <RaisedButton
                                label={txt.advancedSearchButtonText}
                                aria-label={txt.advancedSearchButtonAriaLabel}
                                onClick={this._handleSearchMode}
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
