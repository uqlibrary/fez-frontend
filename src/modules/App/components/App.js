import React from 'react';
import {Route, Switch} from 'react-router';
import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';

import {AppLoader, MenuDrawer, HelpDrawer} from 'uqlibrary-react-toolbox';

import {defaultMenuItems, researcherMenuItems} from 'config';
import {locale} from 'config';
import AuthButton from 'modules/AuthButton';

// Pages
import {Dashboard} from 'modules/Dashboard';
import {Research} from 'modules/Research';
import {AddRecord} from 'modules/AddRecord';
import {StaticPage} from 'uqlibrary-react-toolbox';
import {Browse} from 'modules/Browse';

// Import specific style for the AppBar
import '../../../sass/_appbar.scss';

export default class App extends React.Component {

    static propTypes = {
        error: React.PropTypes.object,
        account: React.PropTypes.object,
        loaded: React.PropTypes.bool.isRequired,
        loadAccount: React.PropTypes.func.isRequired,
        menuDrawerOpen: React.PropTypes.bool.isRequired,
        hideSnackbar: React.PropTypes.func.isRequired,
        snackbar: React.PropTypes.object.isRequired,
        toggleMenuDrawer: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            mediaQuery: window.matchMedia('(min-width: 1600px)')
        };
    }

    /**
     * Set up default values, event handlers when component is mounted
     */
    componentDidMount() {
        this.props.loadAccount();
        this.handleResize(this.state.mediaQuery);
        this.state.mediaQuery.addListener(this.handleResize);
    }

    /**
     * Clean up after the container has been unmounted
     */
    componentWillUnmount() {
        this.state.mediaQuery.removeListener(this.handleResize);
    }

    handleResize = (mediaQuery) => {
        this.setState({
            docked: mediaQuery.matches
        });
    }

    toggleDrawer = () => {
        this.props.toggleMenuDrawer(!this.props.menuDrawerOpen);
    };

    render() {
        const {
            error,
            account,
            loaded,
            menuDrawerOpen,
            snackbar,
            hideSnackbar
        } = this.props;

        const {
            docked
        } = this.state;

        const titleStyle = docked ? { paddingLeft: 320 } : {};
        const container = docked ? { paddingLeft: 340 } : {};

        const isAuthorizedUser = loaded === true && account !== null && account.get('mail');
        const components = { Browse, StaticPage, Dashboard, Research, AddRecord };
        const landingPage =  isAuthorizedUser ? Dashboard : Browse;
        const menuItems = isAuthorizedUser ? [...researcherMenuItems(locale, account.get('mail'), components), ...defaultMenuItems(locale, components)] : defaultMenuItems(locale, components);

        console.log(error);

        return (
            <div className="layout-fill">
                {!loaded ? (
                    <AppLoader title={locale.global.title} logoImage={locale.global.logo} logoText={locale.global.title} />
                    ) : (
                    <div className="layout-fill align-stretch">
                        {/* TODO: app bar buttons should be components */}
                        <AppBar
                            className="AppBar align-center"
                            showMenuIconButton={!docked}
                            style={{height: 75}}
                            iconStyleLeft={{marginTop: 0}}
                            title={locale.global.title}
                            titleStyle={titleStyle}
                            onLeftIconButtonTouchTap={this.toggleDrawer}
                            iconElementRight={
                                <div style={{marginTop: '-10px'}}>
                                    <AuthButton loaded={loaded} account={account}/>
                                </div>
                            }
                        />

                        <MenuDrawer menuItems={menuItems}
                                    drawerOpen={docked || menuDrawerOpen}
                                    docked={docked}
                                    logoImage={locale.global.logo}
                                    logoText={locale.global.title}
                                    toggleDrawer={this.toggleDrawer} />

                        <div className="content-container" style={container}>
                            <Switch>
                                <Route path="/" exact component={landingPage} />
                                {menuItems.map((route, index) => (
                                    <Route key={index} {...route} />
                                ))}
                            </Switch>
                        </div>

                        <Snackbar
                            open={snackbar.get('open')}
                            message={snackbar.get('message')}
                            autoHideDuration={4000}
                            onRequestClose={hideSnackbar} />

                        <HelpDrawer />
                    </div>
                )}
            </div>
        );
    }
}
