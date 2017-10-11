import React from 'react';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router';

import {locale, routes, AUTH_URL_LOGIN, AUTH_URL_LOGOUT} from 'config';

// application components
import AppBar from 'material-ui/AppBar';
import {AppLoader, MenuDrawer, HelpDrawer, AuthButton, StandardPage, Alert} from 'uqlibrary-react-toolbox';
import * as modules from 'modules';

export default class App extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        actions: PropTypes.object,
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
            isMobile: window.matchMedia('(max-width: 768px)').matches
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
        this.setState({
            docked: mediaQuery.matches
        });
    };

    toggleDrawer = () => {
        this.setState({
            menuDrawerOpen: !this.state.menuDrawerOpen
        });
    };

    render() {
        const titleStyle = this.state.docked ? {paddingLeft: 320} : {};
        const container = this.state.docked ? {paddingLeft: 340} : {};

        const isAuthorizedUser = !this.props.user.accountLoading && this.props.user.account !== null;

        const menuItems = routes.getMenuConfig(this.props.user.account);

        // TODO: check if isPublicPage === false && isAuthorizedUser === false and kick user out?
        const isPublicPage = menuItems.filter((menuItem) => (menuItem.public)).length > 0;
        const components = {StandardPage, ...modules};

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
                            iconElementRight={
                                <div style={{marginTop: '-10px'}}>
                                    <AuthButton
                                        isAuthorizedUser={isAuthorizedUser}
                                        loginUrl={AUTH_URL_LOGIN}
                                        logoutUrl={AUTH_URL_LOGOUT}
                                        signInTooltipText={locale.authentication.signInText}
                                        signOutTooltipText={isAuthorizedUser ? (locale.authentication.signOutText + ' - ' + this.props.user.account.name) : ''} />
                                </div>
                            }
                        />

                        <MenuDrawer
                            menuItems={menuItems}
                            drawerOpen={this.state.docked || this.state.menuDrawerOpen}
                            docked={this.state.docked}
                            logoImage={locale.global.logo}
                            logoText={locale.global.title}
                            toggleDrawer={this.toggleDrawer}/>

                        <div className="content-container" style={container}>
                            {
                                // user is not logged in
                                !this.props.user.accountLoading && !this.props.user.account &&
                                <div className="layout-fill">
                                    <div className="layout-card">
                                        <Alert {...locale.global.loginAlert} />
                                    </div>
                                </div>
                            }
                            {
                                // user is logged in, but doesn't have eSpace author identifier
                                !isPublicPage && this.props.user.account && !this.props.user.loadingAuthorDetails && !this.props.user.authorDetails &&
                                <div className="layout-fill">
                                    <div className="layout-card">
                                        <Alert {...locale.global.notRegisteredAuthorAlert} />
                                    </div>
                                </div>
                            }

                            <Switch>
                                {
                                    routes.getRoutesConfig(components, this.props.user.account).map((route, index) => (
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
