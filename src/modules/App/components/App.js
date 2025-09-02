import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { styled } from '@mui/material/styles';
import { pathConfig, routes, SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME } from 'config';
import locale from 'locale/global';
import { isFileUrl } from 'config/routes';
import { redirectUserToLogin } from 'helpers/redirectUserToLogin';
import { useQueryRedirector } from 'hooks/useQueryRedirector';

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

import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import Menu from '@mui/icons-material/Menu';

const StyledGrid = styled(Grid)({
    margin: 0,
    padding: 0,
    maxHeight: '100%',
    height: '100%',
});
const StyledGridCard = styled(Grid)(({ theme }) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    width: '90%',
    padding: 0,
    [theme.breakpoints.down('md')]: {
        margin: '0 auto 24px auto',
    },
}));

const StyledAppTitle = styled(Typography, {
    shouldForwardProp: prop => prop !== 'indentTitle',
})(({ theme, indentTitle }) => ({
    ...(indentTitle ? { textIndent: '290px' } : {}),
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
}));

const AppClass = ({
    account,
    author,
    authorDetails,
    accountLoading,
    accountAuthorLoading,
    accountAuthorDetailsLoading,
    isSessionExpired,
    actions,
    incompleteRecordList,
    customRedirectors,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const hadLoggedInUser = useRef(false);
    const [sessionExpiredConfirmationBox, setSessionExpiredConfirmationBox] = useState(null);
    const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
    const [docked, setDocked] = useState(false);
    const [mediaQuery, setMediaQuery] = useState(window.matchMedia('(min-width: 1280px)'));
    const isMobile = window.matchMedia('(max-width: 720px)').matches;

    const handleResize = mediaQuery => {
        setDocked(mediaQuery.matches);
    };

    useEffect(() => {
        if (!account?.id || hadLoggedInUser.current) return;
        hadLoggedInUser.current = true;
    }, [account?.id]);

    useEffect(() => {
        if (!!Cookies.get(SESSION_COOKIE_NAME) && !!Cookies.get(SESSION_USER_GROUP_COOKIE_NAME)) {
            actions.loadCurrentAccount();
        } else {
            actions.logout();
        }
        handleResize(mediaQuery);
        mediaQuery.addListener(handleResize);
        setMediaQuery(mediaQuery);
        return () => {
            mediaQuery.removeListener(handleResize);
            setMediaQuery(mediaQuery);
        };
    }, [actions, mediaQuery]);

    useEffect(() => {
        if (isSessionExpired) {
            sessionExpiredConfirmationBox.showConfirmation();
        }
    }, [isSessionExpired, sessionExpiredConfirmationBox]);

    useEffect(() => {
        // don't call the api for non author users since the api call requires an author
        if (!accountAuthorLoading && author?.aut_id) {
            actions.searchAuthorPublications({}, 'incomplete');
        }
    }, [accountAuthorLoading, actions, author?.aut_id]);

    const { customRedirect } = useQueryRedirector({ account, rules: customRedirectors });
    // If there's an expected querystring redirection tag in the URL,
    // redirect to the new location as returned by the useQueryRedirector hook
    useEffect(() => {
        customRedirect &&
            location.pathname !== customRedirect.url &&
            navigate(customRedirect.url, customRedirect.options ?? /* istanbul ignore next */ {});
    }, [customRedirect, location.pathname, navigate]);

    const toggleDrawer = () => {
        setMenuDrawerOpen(!menuDrawerOpen);
    };

    const redirectToOrcid = () => {
        if (location.search.indexOf('?') >= 0 && location.search.indexOf('code') >= 0) {
            // if user already received an orcid response - clean up query string by redirecting via window.location
            window.location.assign(pathConfig.authorIdentifiers.orcid.absoluteLink);
        } else {
            navigate(pathConfig.authorIdentifiers.orcid.link);
        }
    };

    const isPublic = menuItems => {
        return (
            menuItems.filter(menuItem => location.pathname === menuItem.linkTo && menuItem.public).length > 0 ||
            new RegExp(pathConfig.records.view(`(${routes.pidRegExp}|${routes.notFound})`)).test(location.pathname)
        );
    };

    const setSessionExpiredConfirmation = ref => {
        setSessionExpiredConfirmationBox(ref);
    };

    if (accountLoading) {
        return (
            <StyledGrid container>
                <Grid zeroMinWidth item xs={12}>
                    <AppLoader title={locale.global.title} logoImage="largeLogo" logoText={locale.global.logo.label} />
                </Grid>
            </StyledGrid>
        );
    }

    const isAuthorizedUser = !accountLoading && account !== null;
    const isAuthorLoading = accountLoading || accountAuthorLoading;
    const isAuthorDetailsLoading = accountLoading || accountAuthorDetailsLoading;
    const isOrcidRequired =
        authorDetails &&
        authorDetails.is_administrator !== 1 &&
        authorDetails.is_super_administrator !== 1 &&
        author?.aut_id &&
        !author.aut_orcid_id &&
        location.pathname !== pathConfig.authorIdentifiers.orcid.link;
    const isHdrStudent =
        !isAuthorLoading &&
        !!account &&
        account.class &&
        account.class.indexOf('IS_CURRENT') >= 0 &&
        account.class.indexOf('IS_UQ_STUDENT_PLACEMENT') >= 0;
    const isAuthor = !isAuthorLoading && !!account && author?.aut_id;
    const hasIncompleteWorks = !!(
        incompleteRecordList &&
        incompleteRecordList.incomplete.publicationsListPagingData &&
        incompleteRecordList.incomplete.publicationsListPagingData.total > 0
    );
    const menuItems = routes.getMenuConfig(
        account,
        author,
        authorDetails,
        isHdrStudent && !isAuthor,
        hasIncompleteWorks,
    );

    const isPublicPage = isPublic(menuItems);
    const isThesisSubmissionPage =
        location.pathname === pathConfig.hdrSubmission || location.pathname === pathConfig.sbsSubmission;
    const isSearchPage =
        location.pathname === pathConfig.records.search || location.pathname === pathConfig.records.search;
    const isJournalRelatedPage = location.pathname?.includes('journal');
    const showMenu = !isThesisSubmissionPage;

    const containerStyle = docked && !isThesisSubmissionPage ? { paddingLeft: 260 } : {};
    if (!isAuthorizedUser && (isThesisSubmissionPage || isFileUrl(location.pathname))) {
        redirectUserToLogin()();
        return <div />;
    }

    let userStatusAlert = null;
    if (
        !accountLoading &&
        !account &&
        // not a public route or a logged-in user who performed a search with an expired session token included
        (!isPublicPage || (hadLoggedInUser.current && location?.pathname === pathConfig.records.search))
    ) {
        // user is not logged in
        userStatusAlert = {
            ...locale.global.loginAlert,
            action: redirectUserToLogin(),
        };
    } else if (!isPublicPage && !isAuthorLoading && !isJournalRelatedPage && account && (!author || !author.aut_id)) {
        // user is logged in, but doesn't have eSpace author identifier
        userStatusAlert = {
            ...locale.global.notRegisteredAuthorAlert,
        };
    } else if (!isPublicPage && !isAuthorLoading && isOrcidRequired && !isHdrStudent && !isThesisSubmissionPage) {
        // user is logged in, but doesn't have ORCID identifier
        userStatusAlert = {
            ...locale.global.noOrcidAlert,
            action: redirectToOrcid,
        };
    } else if (!isPublicPage && !isThesisSubmissionPage && !isAuthorLoading && isOrcidRequired && isHdrStudent) {
        // user is logged in, but doesn't have ORCID identifier
        userStatusAlert = {
            ...locale.global.forceOrcidLinkAlert,
        };
    }
    const routesConfig = routes.getRoutesConfig({
        components: pages,
        authorDetails: authorDetails,
        account: account,
        forceOrcidRegistration: isOrcidRequired && isHdrStudent,
        isHdrStudent: isHdrStudent,
    });
    const titleOffset = docked && !isThesisSubmissionPage ? 284 : 0;
    const isIndex = location.pathname === '/';
    const isAdminPage =
        location.pathname?.startsWith('/admin') ||
        location.pathname?.startsWith('/batch-import') ||
        location.hash?.startsWith('#/admin') ||
        location.pathname?.startsWith('/records/claim') ||
        false;

    return (
        <StyledGrid container>
            <Meta routesConfig={routesConfig} />
            <AppBar className="AppBar" color="primary" position="fixed">
                <Toolbar sx={{ height: '70px' }}>
                    <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        direction="row"
                        wrap="nowrap"
                        justifyContent="flex-start"
                    >
                        {!docked && !menuDrawerOpen && !isThesisSubmissionPage && (
                            <Grid item>
                                <Tooltip
                                    title={locale.global.mainNavButton.tooltip}
                                    placement="bottom-end"
                                    TransitionComponent={Fade}
                                >
                                    <IconButton
                                        aria-label={locale.global.mainNavButton.aria}
                                        style={{ marginLeft: '-12px', marginRight: '12px' }}
                                        onClick={toggleDrawer}
                                        id={'main-menu-button'}
                                        data-analyticsid={'main-menu-button'}
                                        size="large"
                                    >
                                        <Menu style={{ color: 'white' }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        )}
                        <Grid
                            item
                            xs
                            style={{
                                paddingLeft: titleOffset,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            <Grid container spacing={2} alignItems="center" justifyContent="flex-start" wrap={'nowrap'}>
                                {!docked && !menuDrawerOpen && (
                                    <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        <div id="logo" className="smallLogo" style={{ height: 66, width: 60 }}>
                                            {locale.global.logo.label}
                                        </div>
                                    </Grid>
                                )}
                                <Grid item xs style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    <StyledAppTitle variant="h5" component={'h1'} noWrap indentTitle={docked}>
                                        {locale.global.appTitle}
                                    </StyledAppTitle>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* Search */}
                        {!isThesisSubmissionPage && !isSearchPage && (
                            <Grid item xs={2} sm={4}>
                                <SearchComponent
                                    autoFocus={isIndex}
                                    isMobile={isMobile}
                                    isInHeader
                                    showPrefixIcon
                                    showMobileSearchButton
                                />
                            </Grid>
                        )}
                        <Grid item>
                            <AuthButton
                                isAuthorizedUser={isAuthorizedUser}
                                onClick={redirectUserToLogin(
                                    isAuthorizedUser,
                                    isAuthorizedUser && !isHdrStudent && isThesisSubmissionPage,
                                    isAuthorizedUser ? '' : 'adrd=1', // flag redirect to admin dashboard
                                )}
                                signInTooltipText={locale.global.authentication.signInText}
                                signOutTooltipText={
                                    isAuthorizedUser
                                        ? `${locale.global.authentication.signOutText} - ${account.name}`
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
                    drawerOpen={docked || menuDrawerOpen}
                    docked={docked}
                    logoImage="largeLogo"
                    logoText={locale.global.logo.label}
                    logoLink={locale.global.logo.link}
                    onToggleDrawer={toggleDrawer}
                    isMobile={isMobile}
                    locale={{
                        skipNavAriaLabel: locale.global.skipNav.ariaLabel,
                        skipNavTitle: locale.global.skipNav.title,
                        closeMenuLabel: locale.global.mainNavButton.closeMenuLabel,
                    }}
                />
            )}
            <div className="content-container" id="content-container" style={containerStyle}>
                <ScrollTop show containerId="content-container" />

                <div role="region" aria-label="eSpace alerts" style={{ paddingBottom: 24 }}>
                    {!isAdminPage && <alert-list system="espace" />}
                </div>
                <ConfirmDialogBox
                    hideCancelButton
                    onRef={setSessionExpiredConfirmation}
                    onAction={actions.logout}
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
                        <StyledGridCard item>
                            <Alert {...userStatusAlert} />
                        </StyledGridCard>
                    </Grid>
                )}
                <AppAlertContainer />
                {isAuthorLoading && <InlineLoader message={locale.global.loadingUserAccount} />}

                {!isAuthorLoading && !isAuthorDetailsLoading && (
                    <AccountContext.Provider
                        value={{
                            account: {
                                ...account,
                                ...author,
                                ...authorDetails,
                            },
                        }}
                    >
                        <React.Suspense fallback={<ContentLoader message="Loading content" />}>
                            <Routes>
                                {routesConfig.map((route, index) => (
                                    <Route key={`route_${index}`} {...route} />
                                ))}
                            </Routes>
                        </React.Suspense>
                    </AccountContext.Provider>
                )}
            </div>
            <HelpDrawer />
            <OfflineSnackbar />
        </StyledGrid>
    );
};

AppClass.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
    authorDetails: PropTypes.object,
    accountLoading: PropTypes.bool,
    accountAuthorLoading: PropTypes.bool,
    accountAuthorDetailsLoading: PropTypes.bool,
    isSessionExpired: PropTypes.bool,
    actions: PropTypes.object,
    incompleteRecordList: PropTypes.object,
    customRedirectors: PropTypes.object,
};

export default AppClass;
