import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import ArrowForward from '@mui/icons-material/ArrowForward';

import { MAX_PUBLIC_SEARCH_TEXT_LENGTH } from 'config/general';
import { locale } from 'locale';

import Fade from '@mui/material/Fade';

export const SimpleSearchComponent = ({
    searchText,
    autoFocus,
    isInHeader,
    showMobileSearchButton,
    showPrefixIcon,
    onSearch,
    onSearchTextChange,
    onToggleSearchMode,
    onInvalidSearch,
    classes,
}) => {
    const [state, _setState] = React.useState({
        showMobile: false,
        /* istanbul ignore next */
        searchTerm: searchText,
    });

    const setState = newState => {
        _setState({ ...state, ...newState });
    };

    React.useEffect(() => {
        if (state.showMobile) {
            document.getElementById('mobile-search-input')?.focus();
        }
    }, [state.showMobile]);

    const searchTextValidationMessage = value => {
        if (!!value && typeof value === 'string' && value.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            return locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH);
        }

        return null;
    };

    const _handleToggleMobile = () => {
        setState({
            ...state,
            showMobile: !state.showMobile,
        });
    };

    const _handleSearchTextChange = event => {
        setState({ searchTerm: event.target.value });
        onSearchTextChange(event.target.value);
    };

    const _handleSearchMode = () => {
        !!onToggleSearchMode && onToggleSearchMode();
    };

    const _handleSearch = event => {
        if (event && event.key && event.key !== 'Enter') return;

        if (state.searchTerm && state.searchTerm.trim().length === 0) return;
        // search button is disabled when exceeds the max text length
        /* istanbul ignore next */
        if (searchText.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            onInvalidSearch(locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH));
            return;
        }

        // Hide the mobile search bar after performing a search
        setState({
            ...state,
            showMobile: false,
        });

        // Perform search
        onSearch();

        // Blur the input so the mobile keyboard is deactivated
        event && event.target && event.target.blur();
    };

    const _handleSubmit = event => {
        event.preventDefault();
    };

    const txt = locale.components.searchComponent;
    const ariaLabel = { 'aria-label': txt.ariaInputLabel };
    return (
        <React.Fragment>
            <form style={{ margin: 8 }} onSubmit={_handleSubmit}>
                {isInHeader ? (
                    <React.Fragment>
                        {/* DESKTOP in header */}
                        <Grid
                            container
                            alignItems={'center'}
                            spacing={1}
                            wrap={'nowrap'}
                            direction={'row'}
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                backgroundColor: 'white.main',
                                '& input[type="search"]::-webkit-search-cancel-button': {
                                    display: 'none',
                                },
                                width: 'calc(100% + 8px)',
                                margin: '-4px',
                            }}
                            className={classes.inHeader}
                        >
                            {showPrefixIcon && (
                                <Grid
                                    item
                                    xs={'auto'}
                                    sx={{
                                        '&.MuiGrid-item': {
                                            padding: '4px',
                                        },
                                    }}
                                >
                                    <Search
                                        sx={theme => ({ fill: theme.palette.secondary.main, opacity: 0.66 })}
                                        className={classes.searchIconPrefix}
                                    />
                                </Grid>
                            )}
                            <Grid
                                item
                                xs
                                sx={{
                                    '&.MuiGrid-item': {
                                        padding: '4px',
                                    },
                                }}
                            >
                                <TextField
                                    textFieldId="simple-search"
                                    type="search"
                                    autoComplete={'search'}
                                    fullWidth
                                    autoFocus={autoFocus}
                                    label={''}
                                    placeholder={txt.searchBoxPlaceholder}
                                    onChange={_handleSearchTextChange}
                                    onKeyPress={_handleSearch}
                                    value={searchText}
                                    InputProps={{ disableUnderline: true }}
                                    errorText={searchTextValidationMessage(searchText)}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            {/* MOBILE in header */}
                            {!state.showMobile ? (
                                <Tooltip
                                    title={txt.searchBoxPlaceholder}
                                    placement="bottom-end"
                                    TransitionComponent={Fade}
                                    TransitionProps={{ timeout: 300 }}
                                >
                                    <IconButton
                                        onClick={_handleToggleMobile}
                                        aria-label={txt.mobileSearchButtonAriaLabel}
                                        size="large"
                                    >
                                        <Search
                                            sx={theme => ({
                                                fill: theme.palette.white.main,
                                            })}
                                        />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Box
                                    sx={{
                                        zIndex: 100,
                                        backgroundColor: 'white.main',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '70px',
                                    }}
                                    className={classes.mobileHeader}
                                >
                                    <Grid
                                        container
                                        spacing={0}
                                        direction={'row'}
                                        wrap={'nowrap'}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                    >
                                        {showMobileSearchButton && (
                                            <Grid item>
                                                <IconButton onClick={_handleToggleMobile} size="large">
                                                    <Close
                                                        sx={theme => ({
                                                            fill: theme.palette.secondary.main,
                                                            opacity: 0.5,
                                                        })}
                                                        fontSize="inherit"
                                                    />
                                                </IconButton>
                                            </Grid>
                                        )}
                                        <Grid item xs zeroMinWidth>
                                            <TextField
                                                sx={{
                                                    width: '99%',
                                                    height: '70px',
                                                    '& > div': {
                                                        height: '100%',
                                                    },
                                                    '& input': {
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        fontSize: '24px',
                                                        lineHeight: 1.2,
                                                        fontWeight: 'fontWeightNormal',
                                                    },
                                                }}
                                                type="search"
                                                id="mobileSearchField"
                                                textFieldId="mobile-search"
                                                fullWidth
                                                label={''}
                                                placeholder={txt.searchBoxPlaceholder}
                                                inputProps={ariaLabel}
                                                onChange={_handleSearchTextChange}
                                                onKeyPress={_handleSearch}
                                                value={state.searchTerm}
                                                InputProps={{ disableUnderline: true }}
                                                error={searchTextValidationMessage(searchText)}
                                            />
                                        </Grid>
                                        {showMobileSearchButton && (
                                            <Grid item>
                                                <IconButton
                                                    onClick={_handleSearch}
                                                    disabled={state.searchTerm.trim().length === 0}
                                                    size="large"
                                                >
                                                    <ArrowForward fontSize="inherit" />
                                                </IconButton>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {/* NOT in header */}
                        <Grid container spacing={2} alignItems={'center'}>
                            <Grid item xs>
                                <TextField
                                    textFieldId="simple-search"
                                    type="search"
                                    data-testid
                                    fullWidth
                                    label={txt.searchBoxPlaceholder}
                                    placeholder={txt.searchBoxHint}
                                    inputProps={ariaLabel}
                                    onChange={_handleSearchTextChange}
                                    onKeyDown={_handleSearch}
                                    value={searchText}
                                    errorText={searchTextValidationMessage(searchText)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={'auto'}>
                                <Button
                                    children={txt.searchButtonText}
                                    aria-label={txt.searchButtonAriaLabel}
                                    variant={'contained'}
                                    color={'primary'}
                                    disabled={!!searchTextValidationMessage(searchText)}
                                    onClick={_handleSearch}
                                    fullWidth
                                    id="simple-search-button"
                                    data-analyticsid="simple-search-button"
                                    data-testid="simple-search-button"
                                />
                            </Grid>
                            <Grid item xs={12} sm={'auto'}>
                                <Button
                                    variant={'contained'}
                                    color={'default'}
                                    children={txt.advancedSearchButtonText}
                                    aria-label={txt.advancedSearchButtonAriaLabel}
                                    onClick={_handleSearchMode}
                                    className="advancedButton"
                                    fullWidth
                                    id="show-advanced-search"
                                    data-analyticsid="show-advanced-search"
                                    data-testid="show-advanced-search"
                                />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
            </form>
        </React.Fragment>
    );
};
SimpleSearchComponent.propTypes = {
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
    classes: PropTypes.object,
};
SimpleSearchComponent.defaultProps = {
    searchText: '',

    isInHeader: false,
    showSearchButton: false,
    showMobileSearchButton: false,
    showAdvancedSearchButton: false,
    showPrefixIcon: false,

    onSearch: () => {},
    onToggleSearchMode: () => {},
    onInvalidSearch: /* istanbul ignore next */ () => {},
    classes: {},
};

export default React.memo(SimpleSearchComponent);
