import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import Search from '@material-ui/icons/Search';
import ArrowBack from '@material-ui/icons/ArrowBack';

import {MAX_PUBLIC_SEARCH_TEXT_LENGTH} from 'config/general';
import {locale} from 'locale';

import {withStyles} from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';

export const styles = theme => ({
    searchIconPrefix: {
        fill: theme.palette.secondary.main,
        opacity: 0.66
    },
    inHeader: {
        backgroundColor: theme.palette.white.main,
        '& input[type="search"]::-webkit-search-cancel-button': {
            display: 'none'
        }
    },
    searchIconMobile: {
        fill: theme.palette.white.main
    },
    mobileBackArrow: {
        height: 50,
        width: 50,
        fill: theme.palette.secondary.main,
        opacity: 0.5
    },
    mobileBackArrowButton: {
        height: 70,
        width: 70,
    },
    mobileHeader: {
        zIndex: 100,
        backgroundColor: theme.palette.white.main,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 70
    },
    mobileSearchInput: {
        width: '99%',
        height: 70,
        '& input': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: 10,
            fontSize: 32,
            lineHeight: 1.2,
            fontWeight: theme.typography.fontWeightNormal
        }
    }
});

export class SimpleSearchComponent extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        searchText: PropTypes.string,
        autoFocus: PropTypes.bool,

        isInHeader: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showMobileSearchButton: PropTypes.bool,
        showAdvancedSearchButton: PropTypes.bool,
        showPrefixIcon: PropTypes.bool,

        onSearch: PropTypes.func,
        onSearchTextChange: PropTypes.func.isRequired,
        onToggleSearchMode: PropTypes.func,
        onInvalidSearch: PropTypes.func,

        classes: PropTypes.object
    };
    static defaultProps = {
        searchText: '',

        isInHeader: false,
        showSearchButton: false,
        showMobileSearchButton: false,
        showAdvancedSearchButton: false,
        showPrefixIcon: false,

        onSearch: () => {
        },
        onToggleSearchMode: () => {
        },
        onInvalidSearch: () => {
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            showMobile: false
        };
    }

    searchTextValidationMessage = (value) => {
        if (!!value && value.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            return locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH);
        }

        return null;
    };

    _handleToggleMobile = () => {
        this.setState({
            ...this.state,
            showMobile: !this.state.showMobile
        }, () => {
            if (this.state.showMobile) {
                document.getElementById('mobileSearchField') &&
                /* istanbul ignore next */
                document.getElementById('mobileSearchField').focus();
            }
        });
    };

    _handleSearchTextChange = (event) => {
        this.props.onSearchTextChange(event.target.value);
    };

    _handleSearchMode = () => {
        !!this.props.onToggleSearchMode &&
        this.props.onToggleSearchMode();
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

    _handleSubmit = (event) => {
        event.preventDefault();
        this._handleSearch(event);
    }

    render() {
        const txt = locale.components.searchComponent;
        const {classes} = this.props;
        const ariaLabel = {'aria-label': txt.ariaInputLabel};
        return (
            <React.Fragment>
                <form style={{margin: 8}} onSubmit={this._handleSubmit}>
                    {
                        this.props.isInHeader ?
                            <React.Fragment>
                                {/* DESKTOP in header */}
                                <Hidden xsDown>
                                    <Grid container alignItems={'center'} spacing={8} wrap={'nowrap'} className={classes.inHeader} direction={'row'}>
                                        {
                                            this.props.showPrefixIcon &&
                                            <Grid item xs={'auto'}>
                                                <Search className={classes.searchIconPrefix}/>
                                            </Grid>
                                        }
                                        <Grid item xs>
                                            <TextField
                                                type="search"
                                                autoComplete={'search'}
                                                fullWidth
                                                id="simpleSearchField"
                                                autoFocus={this.props.autoFocus}
                                                label={false}
                                                placeholder={txt.searchBoxPlaceholder}
                                                inputProps={ariaLabel}
                                                onChange={this._handleSearchTextChange}
                                                onKeyPress={this._handleSearch}
                                                value={this.props.searchText}
                                                InputProps={{disableUnderline: true}}
                                                error={this.searchTextValidationMessage(this.props.searchText)}/>
                                        </Grid>
                                    </Grid>
                                </Hidden>
                                {/* MOBILE in header */}
                                <Hidden smUp>
                                    {
                                        !this.state.showMobile ?
                                            <Tooltip title={txt.searchBoxPlaceholder} placement="bottom-end" TransitionComponent={Fade} TransitionProps={{ timeout: 300 }}>
                                                <IconButton
                                                    onClick={this._handleToggleMobile}
                                                    aria-label={txt.mobileSearchButtonAriaLabel}>
                                                    <Search className={classes.searchIconMobile}/>
                                                </IconButton>
                                            </Tooltip>
                                            :
                                            <div className={classes.mobileHeader}>
                                                <Grid container spacing={0} direction={'row'} wrap={'nowrap'} alignItems={'stretch'} justify={'center'}>
                                                    {
                                                        this.props.showMobileSearchButton &&
                                                        <Hidden smUp>
                                                            <Grid item>
                                                                <Button onClick={this._handleToggleMobile} className={classes.mobileBackArrowButton}>
                                                                    <ArrowBack className={classes.mobileBackArrow}/>
                                                                </Button>
                                                            </Grid>
                                                        </Hidden>
                                                    }
                                                    <Grid item xs zeroMinWidth>
                                                        <TextField
                                                            className={classes.mobileSearchInput}
                                                            type="search"
                                                            id="mobileSearchField"
                                                            fullWidth
                                                            label={false}
                                                            placeholder={txt.searchBoxPlaceholder}
                                                            inputProps={ariaLabel}
                                                            onChange={this._handleSearchTextChange}
                                                            onKeyPress={this._handleSearch}
                                                            value={this.props.searchText}
                                                            InputProps={{disableUnderline: true}}
                                                            error={this.searchTextValidationMessage(this.props.searchText)}/>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                    }
                                </Hidden>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                {/* NOT in header */}
                                <Grid container spacing={16} alignItems={'center'}>
                                    <Grid item xs>
                                        <TextField
                                            type="search"
                                            id="simpleSearchField"
                                            fullWidth
                                            label={!this.props.isInHeader && txt.searchBoxPlaceholder}
                                            placeholder={txt.searchBoxHint}
                                            inputProps={ariaLabel}
                                            onChange={this._handleSearchTextChange}
                                            onKeyPress={this._handleSearch}
                                            value={this.props.searchText}
                                            error={this.searchTextValidationMessage(this.props.searchText)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={'auto'}>
                                        <Button
                                            children={txt.searchButtonText}
                                            aria-label={txt.searchButtonAriaLabel}
                                            variant={'contained'}
                                            color={'primary'}
                                            disabled={!!this.searchTextValidationMessage(this.props.searchText)}
                                            onClick={this._handleSearch}
                                            fullWidth
                                            id="simpleSearchButton"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={'auto'}>
                                        <Button
                                            variant={'contained'}
                                            children={txt.advancedSearchButtonText}
                                            aria-label={txt.advancedSearchButtonAriaLabel}
                                            onClick={this._handleSearchMode}
                                            className="advancedButton"
                                            fullWidth
                                            id="showAdvancedSearchButton"
                                        />
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                    }
                </form>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(SimpleSearchComponent);
