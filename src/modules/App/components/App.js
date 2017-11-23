import React from 'react';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router';

import {locale, routes, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, APP_URL} from 'config';

// application components
import AppBar from 'material-ui/AppBar';
import {AppLoader, MenuDrawer, HelpDrawer, AuthButton, Alert} from 'uqlibrary-react-toolbox';
import * as pages from './pages';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

export default class App extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object.isRequired
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
            isMobile: window.matchMedia('(max-width: 720px)').matches
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

    componentWillUnmount() {
        this.state.mediaQuery.removeListener(this.handleResize);
    }

    handleResize = (mediaQuery) => {
        console.log(mediaQuery);
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
        const menuItems = routes.getMenuConfig(this.props.user.account);
        const appBarButtonStyles = {backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%'};
        const isAuthorizedUser = !this.props.user.accountLoading && this.props.user.account !== null;
        const isAuthorLoading = this.props.user.accountLoading || this.props.user.authorLoading || this.props.user.loadingAuthorDetails;
        const isPublicPage = menuItems.filter((menuItem) =>
            (this.props.location.pathname === menuItem.linkTo && menuItem.public)).length > 0;
        const isOrcidRequired = this.props.user.author && !this.props.user.author.aut_orcid_id
            && this.props.location.pathname !== routes.pathConfig.authorIdentifiers.orcid.link;

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
                                        signInTooltipText={locale.authentication.signInText}
                                        signOutTooltipText={isAuthorizedUser ? (`${locale.authentication.signOutText} - ${this.props.user.account.name}`) : ''} />
                                </div>
                            }
                        />

                        <MenuDrawer
                            menuItems={menuItems}
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
                            {
                                // user is not logged in
                                !this.props.user.accountLoading && !this.props.user.account &&
                                <div className="layout-fill dashAlert">
                                    <div className="layout-card">
                                        <Alert {...locale.global.loginAlert} action={this.redirectUserToLogin} />
                                    </div>
                                </div>
                            }
                            {
                                // user is logged in, but doesn't have eSpace author identifier
                                !isPublicPage && !isAuthorLoading && !this.props.user.authorDetails &&
                                <div className="layout-fill dashAlert">
                                    <div className="layout-card">
                                        <Alert {...locale.global.notRegisteredAuthorAlert} />
                                    </div>
                                </div>
                            }

                            {
                                // user is logged in, but doesn't have ORCID identifier
                                !isPublicPage && !isAuthorLoading && isOrcidRequired &&
                                <div className="layout-fill dashAlert">
                                    <div className="layout-card">
                                        <Alert {...locale.global.noOrcidAlert} action={this.redirectToOrcid} />
                                    </div>
                                </div>
                            }

                            <Switch>
                                {
                                    routes.getRoutesConfig(pages, this.props.user.account).map((route, index) => (
                                        <Route key={`route_${index}`} {...route} />
                                    ))
                                }
                            </Switch>

                        </div>
                        <HelpDrawer/>
                    </div>
                }
            </div>
        );
    }
}
