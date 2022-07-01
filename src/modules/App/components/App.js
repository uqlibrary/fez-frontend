import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import Cookies from 'js-cookie';
import {
    APP_URL,
    AUTH_URL_LOGIN,
    AUTH_URL_LOGOUT,
    pathConfig,
    routes,
    SESSION_COOKIE_NAME,
    SESSION_USER_GROUP_COOKIE_NAME,
} from 'config';
import locale from 'locale/global';
import { isFileUrl } from 'config/routes';

// application components
import { AppLoader, ContentLoader, InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ScrollTop } from 'modules/SharedComponents/ScrollTop';
import { MenuDrawer } from 'modules/SharedComponents/Toolbox/MenuDrawer';
import { HelpDrawer } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import { AuthButton } from 'modules/SharedComponents/Toolbox/AuthButton';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import AppAlertContainer from '../containers/AppAlert';
import { Meta } from 'modules/SharedComponents/Meta';
import { OfflineSnackbar } from 'modules/SharedComponents/OfflineSnackbar';
import { SearchComponent } from 'modules/SharedComponents/SearchComponent';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import * as pages from './pages';
import { AccountContext } from 'context';
// MUI1
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    appBG: {
        ...theme.palette.primary.main,
    },
    layoutCard: {
        maxWidth: '1200px',
        margin: '24px auto',
        width: '90%',
        padding: 0,
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 24px auto',
        },
    },
    layoutFill: {
        margin: 0,
        padding: 0,
        maxHeight: '100%',
        height: '100%',
    },
    titleLink: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        color: theme.palette.common.white,
        '& a': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    },
    nowrap: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});

export class AppClass extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        authorDetails: PropTypes.object,
        accountLoading: PropTypes.bool,
        accountAuthorLoading: PropTypes.bool,
        accountAuthorDetailsLoading: PropTypes.bool,
        isSessionExpired: PropTypes.bool,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object,
        // incomplete Records
        loadingIncompleteRecordData: PropTypes.bool,
        incompleteRecordList: PropTypes.object,
    };
    static childContextTypes = {
        userCountry: PropTypes.any,
        isMobile: PropTypes.bool,
        selectFieldMobileOverrides: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            menuDrawerOpen: false,
            docked: false,
            mediaQuery: window.matchMedia('(min-width: 1280px)'),
            isMobile: window.matchMedia('(max-width: 720px)').matches,
        };
    }

    getChildContext() {
        return {
            userCountry: 'AU', // this.state.userCountry,
            isMobile: this.state.isMobile,
            selectFieldMobileOverrides: {
                style: !this.state.isMobile ? { width: '100%' } : {},
                autoWidth: !this.state.isMobile,
                fullWidth: this.state.isMobile,
                menuItemStyle: this.state.isMobile
                    ? {
                          whiteSpace: 'normal',
                          lineHeight: '18px',
                          paddingBottom: '8px',
                      }
                    : {},
            },
        };
    }

    componentDidMount() {
        if (!!Cookies.get(SESSION_COOKIE_NAME) && !!Cookies.get(SESSION_USER_GROUP_COOKIE_NAME)) {
            this.props.actions.loadCurrentAccount();
        } else {
            this.props.actions.logout();
        }
        this.handleResize(this.state.mediaQuery);
        this.state.mediaQuery.addListener(this.handleResize);
    }
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isSessionExpired) {
            this.sessionExpiredConfirmationBox.showConfirmation();
        }
        // don't call the api for non author users since the api call requires an author
        if (
            !nextProps.accountAuthorLoading &&
            // eslint-disable-next-line camelcase
            nextProps.author?.aut_id &&
            // eslint-disable-next-line camelcase
            this.props.author?.aut_id !== nextProps.author?.aut_id
        ) {
            this.props.actions.searchAuthorPublications({}, 'incomplete');
        }
    }

    componentWillUnmount() {
        this.state.mediaQuery.removeListener(this.handleResize);
    }

    handleResize = mediaQuery => {
        this.setState({
            docked: mediaQuery.matches,
        });
    };

    toggleDrawer = () => {
        this.setState({
            menuDrawerOpen: !this.state.menuDrawerOpen,
        });
    };

    redirectUserToLogin = (isAuthorizedUser = false, redirectToCurrentLocation = false) => () => {
        /* istanbul ignore next */
        if (process.env.USE_MOCK) {
            return;
        }
        const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
        window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
    };

    redirectToOrcid = () => {
        if (window.location.search.indexOf('?') >= 0 && window.location.search.indexOf('code') >= 0) {
            // if user already received an orcid response - clean up query string by redirecting via window.location
            window.location.assign(pathConfig.authorIdentifiers.orcid.absoluteLink);
        } else {
            this.props.history.push(pathConfig.authorIdentifiers.orcid.link);
        }
    };

    isPublicPage = menuItems => {
        return (
            menuItems.filter(menuItem => this.props.location.pathname === menuItem.linkTo && menuItem.public).length >
                0 ||
            new RegExp(pathConfig.records.view(`(${routes.pidRegExp}|${routes.notFound})`)).test(
                this.props.location.pathname,
            )
        );
    };

    setSessionExpiredConfirmation = ref => {
        this.sessionExpiredConfirmationBox = ref;
    };

    render() {
        const { classes } = this.props;
        if (this.props.accountLoading) {
            return (
                <Grid container className={classes.layoutFill}>
                    <Grid zeroMinWidth item xs={12}>
                        <AppLoader
                            title={locale.global.title}
                            logoImage="largeLogo"
                            logoText={locale.global.logo.label}
                        />
                    </Grid>
                </Grid>
            );
        }

        const isAuthorizedUser = !this.props.accountLoading && this.props.account !== null;
        const isAuthorLoading = this.props.accountLoading || this.props.accountAuthorLoading;
        const isAuthorDetailsLoading = this.props.accountLoading || this.props.accountAuthorDetailsLoading;
        const isOrcidRequired =
            this.props.authorDetails &&
            this.props.authorDetails.is_administrator !== 1 &&
            this.props.authorDetails.is_super_administrator !== 1 &&
            // eslint-disable-next-line camelcase
            this.props.author?.aut_id &&
            !this.props.author.aut_orcid_id &&
            this.props.location.pathname !== pathConfig.authorIdentifiers.orcid.link;
        const isHdrStudent =
            !isAuthorLoading &&
            !!this.props.account &&
            this.props.account.class &&
            this.props.account.class.indexOf('IS_CURRENT') >= 0 &&
            this.props.account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0;
        // eslint-disable-next-line camelcase
        const isAuthor = !isAuthorLoading && !!this.props.account && this.props.author?.aut_id;
        const hasIncompleteWorks = !!(
            this.props.incompleteRecordList &&
            this.props.incompleteRecordList.incomplete.publicationsListPagingData &&
            this.props.incompleteRecordList.incomplete.publicationsListPagingData.total > 0
        );
        const menuItems = routes.getMenuConfig(
            this.props.account,
            this.props.author,
            this.props.authorDetails,
            isHdrStudent && !isAuthor,
            hasIncompleteWorks,
        );
        const isPublicPage = this.isPublicPage(menuItems);
        const isThesisSubmissionPage =
            this.props.location.pathname === pathConfig.hdrSubmission ||
            this.props.location.pathname === pathConfig.sbsSubmission;
        const isSearchPage =
            this.props.location.pathname === pathConfig.records.search ||
            this.props.location.pathname === pathConfig.records.search;
        const isJournalRelatedPage = this.props.location.pathname?.includes('journal');
        const showMenu = !isThesisSubmissionPage;

        const containerStyle = this.state.docked && !isThesisSubmissionPage ? { paddingLeft: 260 } : {};
        if (!isAuthorizedUser && (isThesisSubmissionPage || isFileUrl(this.props.location.pathname))) {
            this.redirectUserToLogin()();
            return <div />;
        }

        let userStatusAlert = null;
        if (!this.props.accountLoading && !this.props.account && !isPublicPage) {
            // user is not logged in
            userStatusAlert = {
                ...locale.global.loginAlert,
                action: this.redirectUserToLogin(),
            };
            // eslint-disable-next-line camelcase
        } else if (
            !isPublicPage &&
            !isAuthorLoading &&
            !isJournalRelatedPage &&
            this.props.account &&
            (!this.props.author || !this.props.author.aut_id)
        ) {
            // user is logged in, but doesn't have eSpace author identifier
            userStatusAlert = {
                ...locale.global.notRegisteredAuthorAlert,
            };
        } else if (!isPublicPage && !isAuthorLoading && isOrcidRequired && !isHdrStudent && !isThesisSubmissionPage) {
            // user is logged in, but doesn't have ORCID identifier
            userStatusAlert = {
                ...locale.global.noOrcidAlert,
                action: this.redirectToOrcid,
            };
        } else if (!isPublicPage && !isThesisSubmissionPage && !isAuthorLoading && isOrcidRequired && isHdrStudent) {
            // user is logged in, but doesn't have ORCID identifier
            userStatusAlert = {
                ...locale.global.forceOrcidLinkAlert,
            };
        }
        const routesConfig = routes.getRoutesConfig({
            components: pages,
            authorDetails: this.props.authorDetails,
            account: this.props.account,
            forceOrcidRegistration: isOrcidRequired && isHdrStudent,
            isHdrStudent: isHdrStudent,
        });
        const titleStyle = this.state.docked && !isThesisSubmissionPage ? { paddingLeft: 284 } : { paddingLeft: 0 };
        const isIndex = this.props.history.location.pathname === '/';
        const isAdminPage = () => {
            return window?.location?.pathname?.startsWith('/admin') || false;
        };

        return (
            <Grid container className={classes.layoutFill}>
                <Meta routesConfig={routesConfig} />
                <AppBar className="AppBar" color="primary" position="fixed">
                    <Toolbar style={{ height: '70px' }}>
                        <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            direction="row"
                            wrap="nowrap"
                            justifyContent="flex-start"
                        >
                            {!this.state.docked && !this.state.menuDrawerOpen && !isThesisSubmissionPage && (
                                <Grid item>
                                    <Tooltip
                                        title={locale.global.mainNavButton.tooltip}
                                        placement="bottom-end"
                                        TransitionComponent={Fade}
                                    >
                                        <IconButton
                                            aria-label={locale.global.mainNavButton.aria}
                                            style={{ marginLeft: '-12px', marginRight: '12px' }}
                                            onClick={this.toggleDrawer}
                                            id={'main-menu-button'}
                                        >
                                            <Menu style={{ color: 'white' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )}
                            <Grid item xs style={titleStyle} className={classes.nowrap}>
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems="center"
                                    justifyContent="flex-start"
                                    wrap={'nowrap'}
                                >
                                    {!this.state.docked && !this.state.menuDrawerOpen && (
                                        <Hidden xsDown>
                                            <Grid item>
                                                <div id="logo" className="smallLogo" style={{ height: 66, width: 60 }}>
                                                    {locale.global.logo.label}
                                                </div>
                                            </Grid>
                                        </Hidden>
                                    )}
                                    <Grid item xs={'auto'} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <Typography variant="h5" component={'h1'} noWrap className={classes.titleLink}>
                                            {locale.global.appTitle}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Search */}
                            {!isThesisSubmissionPage && !isSearchPage && (
                                <Grid item xs={2} sm={4}>
                                    <SearchComponent
                                        autoFocus={isIndex}
                                        isInHeader
                                        showPrefixIcon
                                        showMobileSearchButton
                                    />
                                </Grid>
                            )}
                            <Grid item>
                                <AuthButton
                                    isAuthorizedUser={isAuthorizedUser}
                                    onClick={this.redirectUserToLogin(
                                        isAuthorizedUser,
                                        isAuthorizedUser && !isHdrStudent && isThesisSubmissionPage,
                                    )}
                                    signInTooltipText={locale.global.authentication.signInText}
                                    signOutTooltipText={
                                        isAuthorizedUser
                                            ? `${locale.global.authentication.signOutText} - ${this.props.account.name}`
                                            : ''
                                    }
                                    ariaLabel={
                                        isAuthorizedUser
                                            ? locale.global.authentication.ariaOut
                                            : locale.global.authentication.ariaIn
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                {showMenu && (
                    <MenuDrawer
                        hasIncompleteWorks={hasIncompleteWorks || false}
                        menuItems={menuItems}
                        drawerOpen={this.state.docked || this.state.menuDrawerOpen}
                        docked={this.state.docked}
                        history={this.props.history}
                        logoImage="largeLogo"
                        logoText={locale.global.logo.label}
                        logoLink={locale.global.logo.link}
                        onToggleDrawer={this.toggleDrawer}
                        isMobile={this.state.isMobile}
                        locale={{
                            skipNavAriaLabel: locale.global.skipNav.ariaLabel,
                            skipNavTitle: locale.global.skipNav.title,
                            closeMenuLabel: locale.global.mainNavButton.closeMenuLabel,
                        }}
                    />
                )}
                <div className="content-container" id="content-container" style={containerStyle}>
                    <Hidden smDown>
                        <ScrollTop show containerId="content-container" />
                    </Hidden>
                    <div role="region" aria-label="eSpace alerts" style={{ paddingBottom: 24 }}>
                        {!isAdminPage() && <alert-list system="espace" />}
                    </div>
                    <ConfirmDialogBox
                        hideCancelButton
                        onRef={this.setSessionExpiredConfirmation}
                        onAction={this.props.actions.logout}
                        locale={locale.global.sessionExpiredConfirmation}
                    />
                    {userStatusAlert && (
                        <Grid
                            container
                            alignContent="center"
                            justifyContent="center"
                            alignItems="center"
                            style={{ marginBottom: 12 }}
                        >
                            <Grid item className={classes.layoutCard} style={{ marginTop: 0, marginBottom: 0 }}>
                                <Alert {...userStatusAlert} />
                            </Grid>
                        </Grid>
                    )}
                    <AppAlertContainer />
                    {isAuthorLoading && <InlineLoader message={locale.global.loadingUserAccount} />}

                    {!isAuthorLoading && !isAuthorDetailsLoading && (
                        <AccountContext.Provider
                            value={{
                                account: { ...this.props.account, ...this.props.author, ...this.props.authorDetails },
                            }}
                        >
                            <React.Suspense fallback={<ContentLoader message="Loading content" />}>
                                <Switch>
                                    {routesConfig.map((route, index) => (
                                        <Route key={`route_${index}`} {...route} />
                                    ))}
                                </Switch>
                            </React.Suspense>
                        </AccountContext.Provider>
                    )}
                </div>
                <HelpDrawer />
                <OfflineSnackbar />
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(AppClass);
