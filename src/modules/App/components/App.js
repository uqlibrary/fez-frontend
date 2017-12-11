import React from 'react';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router';
import {routes, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, APP_URL} from 'config';
import {locale} from 'locale';

// application components
import AppBar from 'material-ui/AppBar';
import {AppLoader} from 'uqlibrary-react-toolbox/build/Loaders';
import {MenuDrawer} from 'uqlibrary-react-toolbox/build/MenuDrawer';
import {HelpDrawer} from 'uqlibrary-react-toolbox/build/HelpDrawer';
import {AuthButton} from 'uqlibrary-react-toolbox/build/AuthButton';

import AppAlertContainer from '../containers/AppAlert';
import InlineLoader from 'uqlibrary-react-toolbox/build/Loaders/components/InlineLoader';

import * as pages from './pages';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

export default class App extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object.isRequired,
    };

    static childContextTypes = {
        isMobile: PropTypes.bool,
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            menuDrawerOpen: false,
            docked: false,
            mediaQuery: window.matchMedia('(min-width: 1600px)'),
            isMobile: window.matchMedia('(max-width: 720px)').matches,
            menuItems: routes.getMenuConfig(props.user.account)
        };
    }

    getChildContext() {
        return {
            isMobile: this.state.isMobile,
            selectFieldMobileOverrides: {
                style: !this.state.isMobile ? {width: '100%'} : {},
                autoWidth: !this.state.isMobile,
                fullWidth: this.state.isMobile,
                menuItemStyle: this.state.isMobile ? {whiteSpace: 'normal', lineHeight: '18px', paddingBottom: '8px'} : {},
            }
        };
    }

    componentDidMount() {
        this.props.actions.loadCurrentAccount();
        this.handleResize(this.state.mediaQuery);
        this.state.mediaQuery.addListener(this.handleResize);
    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps(nextProps)');
        console.log(nextProps);

        if (this.props.user.account !== nextProps.user.account) {
            this.setState({
                menuItems: routes.getMenuConfig(nextProps.user.account)
            });
        }

        const isAuthorLoadingNextProps = nextProps.user.accountLoading || nextProps.user.accountAuthorLoading || nextProps.user.accountAuthorDetailsLoading;
        const isAuthorLoadingThisProps = this.props.user.accountLoading || this.props.user.accountAuthorLoading || this.props.user.accountAuthorDetailsLoading;
        if (isAuthorLoadingNextProps !== isAuthorLoadingThisProps || nextProps.location.pathname !== this.props.location.pathname) {
            const isOrcidRequired = nextProps.user.author && !nextProps.user.author.aut_orcid_id
                && nextProps.location.pathname !== routes.pathConfig.authorIdentifiers.orcid.link;
            const isPublicPage = this.state.menuItems.filter((menuItem) =>
                (nextProps.location.pathname === menuItem.linkTo && menuItem.public)).length > 0;

            // user is not logged in
            if (!nextProps.user.accountLoading && !nextProps.user.account) {
                this.props.actions.showAppAlert({
                    ...locale.global.loginAlert,
                    action: this.redirectUserToLogin
                });
            } else {
                // user is logged in, but doesn't have ORCID identifier
                if (!isPublicPage && !isAuthorLoadingNextProps && isOrcidRequired) {
                    this.props.actions.showAppAlert({
                        ...locale.global.noOrcidAlert,
                        action: this.redirectToOrcid
                    });
                }

                // user is logged in, but doesn't have eSpace author identifier
                if (!isPublicPage && !isAuthorLoadingNextProps && !nextProps.user.authorDetails) {
                    this.props.actions.showAppAlert({
                        ...locale.global.notRegisteredAuthorAlert
                    });
                }

                // hide user specific alerts on public pages
                if (isPublicPage) {
                    this.props.actions.dismissAppAlert();
                }
            }
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.props.user.accountLoading !== nextProps.user.accountLoading
    //         || this.props.user.accountAuthorLoading !== nextProps.user.accountAuthorLoading
    //         || this.props.user.accountAuthorDetailsLoading !== nextProps.user.accountAuthorDetailsLoading
    //         || (!!this.props.location && !!nextProps.location && this.props.location.pathname !== nextProps.location.pathname)
    //         || (!!this.props.history && !!nextState.history && this.props.history.push !== nextState.history.push)
    //         || this.state !== nextState;
    // }

    componentWillUnmount() {
        this.state.mediaQuery.removeListener(this.handleResize);
    }

    handleResize = (mediaQuery) => {
        this.setState({
            docked: mediaQuery.matches
        });
    };

    toggleDrawer = () => {
        this.setState({
            menuDrawerOpen: !this.state.menuDrawerOpen
        });
    };

    redirectUserToLogin = () => {
        const redirectUrl = (!this.props.user.accountLoading && this.props.user.account !== null) ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = window.btoa((!this.props.user.accountLoading && this.props.user.account !== null) ? APP_URL : window.location.href);
        window.location.assign(`${redirectUrl}?return=${returnUrl}`);
    };

    redirectToOrcid = () => {
        this.props.history.push(routes.pathConfig.authorIdentifiers.orcid.link);
    };

    render() {
        const titleStyle = this.state.docked ? {paddingLeft: 320} : {};
        const container = this.state.docked ? {paddingLeft: 340} : {};

        const appBarButtonStyles = {backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%'};
        const isAuthorizedUser = !this.props.user.accountLoading && this.props.user.account !== null;
        const isAuthorLoading = this.props.user.accountLoading || this.props.user.accountAuthorLoading || this.props.user.accountAuthorDetailsLoading;

        return (
            <div className="layout-fill">
                {
                    this.props.user.accountLoading &&
                    <AppLoader
                        title={locale.global.title}
                        logoImage={locale.global.logo}
                        logoText={locale.global.title}/>
                }
                {
                    !this.props.user.accountLoading &&
                    <div className="layout-fill align-stretch">
                        <AppBar
                            className="AppBar align-center"
                            showMenuIconButton={!this.state.docked}
                            style={{height: 75}}
                            iconStyleLeft={{marginTop: 0}}
                            title={locale.global.title}
                            titleStyle={titleStyle}
                            onLeftIconButtonTouchTap={this.toggleDrawer}
                            iconElementLeft={
                                <IconButton
                                    tooltip={locale.global.mainNavButton.tooltip}
                                    tooltipPosition="bottom-right"
                                    hoveredStyle={appBarButtonStyles}
                                    tabIndex={(this.state.docked || !this.state.menuDrawerOpen) ? 1 : -1} >
                                    <NavigationMenu />
                                </IconButton>
                            }
                            iconElementRight={
                                <div style={{marginTop: '-10px'}}>
                                    <AuthButton
                                        isAuthorizedUser={isAuthorizedUser}
                                        hoveredStyle={appBarButtonStyles}
                                        onClick={this.redirectUserToLogin}
                                        signInTooltipText={locale.global.authentication.signInText}
                                        signOutTooltipText={isAuthorizedUser ? (`${locale.global.authentication.signOutText} - ${this.props.user.account.name}`) : ''} />
                                </div>
                            }
                        />

                        <MenuDrawer
                            menuItems={this.state.menuItems}
                            drawerOpen={this.state.docked || this.state.menuDrawerOpen}
                            docked={this.state.docked}
                            history={this.props.history}
                            logoImage={locale.global.logo}
                            logoText={locale.global.title}
                            onToggleDrawer={this.toggleDrawer}
                            isMobile={this.state.isMobile}
                            locale={{
                                skipNavAriaLabel: locale.global.skipNav.ariaLabel,
                                skipNavTitle: locale.global.skipNav.title,
                                closeMenuLabel: locale.global.mainNavButton.closeMenuLabel
                            }} />

                        <div className="content-container" style={container}>
                            <AppAlertContainer />
                            {
                                isAuthorLoading &&
                                <div className="isLoading is-centered">
                                    <InlineLoader message={locale.global.loadingUserAccount}/>
                                </div>
                            }
                            {
                                !isAuthorLoading &&
                                <Switch>
                                    {
                                        routes.getRoutesConfig(pages, this.props.user.account).map((route, index) => (
                                            <Route key={`route_${index}`} {...route} />
                                        ))
                                    }
                                </Switch>
                            }
                        </div>
                        <HelpDrawer/>
                    </div>
                }
            </div>
        );
    }
}
