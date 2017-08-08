import React from 'react';
import PropTypes from 'prop-types';

import {Route, Switch} from 'react-router';
import AppBar from 'material-ui/AppBar';

import {AppLoader, MenuDrawer, HelpDrawer, AuthButton, Alert} from 'uqlibrary-react-toolbox';

import {
    locale,
    defaultMenuItems,
    researcherMenuItems,
    AUTH_URL_LOGIN,
    AUTH_URL_LOGOUT
} from 'config';

// Pages
import {Dashboard} from 'modules/Dashboard';
import {Research} from 'modules/Research';
import {AddRecord} from 'modules/AddRecord';
import {StandardPage} from 'uqlibrary-react-toolbox';
import {Browse} from 'modules/Browse';
import {ClaimPublication} from 'modules/ClaimPublication';
import {ClaimPublicationForm} from 'modules/ClaimPublicationForm';

export default class App extends React.Component {

    static propTypes = {
        user: PropTypes.object,
        location: PropTypes.object, // react-router prop
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            menuDrawerOpen: false,
            docked: false,
            mediaQuery: window.matchMedia('(min-width: 1600px)')
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
        const titleStyle = this.state.docked ? { paddingLeft: 320 } : {};
        const container = this.state.docked ? { paddingLeft: 340 } : {};

        const isAuthorizedUser = !this.props.user.accountLoading && this.props.user.account !== null;

        const components = {
            Browse, StandardPage, Dashboard, Research, AddRecord, ClaimPublication
        };

        const menuItems =
            isAuthorizedUser ?
            [
                ...researcherMenuItems(locale, this.props.user.account.mail, components),
                ...defaultMenuItems(locale, components)
            ]
            :
            defaultMenuItems(locale, components);

        // TODO: check if isPublicPage === false && isAuthorizedUser === false and kick user out?
        const isPublicPage = defaultMenuItems(locale, components).filter((menuItem) => {
            return menuItem.path === this.props.location.pathname;
        }).length > 0;

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
                                    <AuthButton isAuthorizedUser={isAuthorizedUser}
                                                loginUrl={AUTH_URL_LOGIN}
                                                logoutUrl={AUTH_URL_LOGOUT}
                                                signInTooltipText={locale.authentication.signInText}
                                                signOutTooltipText={isAuthorizedUser ? (locale.authentication.signOutText + ' - ' + this.props.user.account.name) : ''}
                                    />
                                </div>
                            }
                        />

                        <MenuDrawer menuItems={menuItems}
                                    drawerOpen={this.state.docked || this.state.menuDrawerOpen}
                                    docked={this.state.docked}
                                    logoImage={locale.global.logo}
                                    logoText={locale.global.title}
                                    toggleDrawer={this.toggleDrawer}/>

                        <div className="content-container" style={container}>
                            {
                                // user is not logged in
                                !this.props.user.accountLoading && !this.props.user.account &&
                                <Alert {...locale.global.loginAlert} outsideLayout />
                            }
                            {
                                // user is logged in, but doesn't have eSpace author identifier
                                !isPublicPage && !this.props.user.authorDetailsLoading && !this.props.user.authorDetails &&
                                <Alert {...locale.global.notRegisteredAuthorAlert} outsideLayout />
                            }
                            <Switch>
                                <Route path="/claim-publication-form" component={ClaimPublicationForm}/>
                                {menuItems.map((route, index) => (
                                    <Route key={index} {...route} />
                                ))}
                            </Switch>
                            <Route path="/" exact render={() => (isAuthorizedUser ? Dashboard : Browse(locale.pages.browse))}/>
                        </div>
                        <HelpDrawer />
                    </div>
                }
            </div>
        );
    }
}
