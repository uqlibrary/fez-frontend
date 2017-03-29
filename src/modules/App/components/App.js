/* eslint-disable */
// TODO: remove all eslint-disable

import React from 'react';
import {Route, Switch} from 'react-router';
import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';

import {AppLoader} from 'modules/Toolbox';
import {MenuDrawer} from 'uqlibrary-react-toolbox';

// review HelpDrawer component export - it's not loading correctly
// import {HelpDrawer} from 'uqlibrary-react-toolbox';
import {defaultMenuItems, researcherMenuItems} from 'config';

// Pages
import {Dashboard} from 'modules/Dashboard';
import {Research} from 'modules/Research';
import {AddRecord} from 'modules/AddRecord';
import {About} from 'modules/About';
import {Browse} from 'modules/Browse';

const mediaQuery = window.matchMedia('(min-width: 1600px)');

export default class App extends React.Component {
    static propTypes = {
        account: React.PropTypes.object,
        loaded: React.PropTypes.bool.isRequired,
        loadAccount: React.PropTypes.func.isRequired,
        menuDrawerOpen: React.PropTypes.bool.isRequired,
        hideSnackbar: React.PropTypes.func.isRequired,
        snackbar: React.PropTypes.object.isRequired,
        toggleMenuDrawer: React.PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.loadAccount();
    }

    toggleDrawer = () => {
        this.props.toggleMenuDrawer(!this.props.menuDrawerOpen);
    };

    render() {
        const {
            account,
            loaded,
            menuDrawerOpen,
            snackbar,
            hideSnackbar
        } = this.props;

        const docked = mediaQuery.matches;
        const titleStyle = docked ? { paddingLeft: 320 } : {};
        const container = docked ? { paddingLeft: 340 } : {};

        const menuItems = loaded === true && account !== null && account.get('mail') ?
            [...researcherMenuItems(account.get('mail')), ...defaultMenuItems()] : defaultMenuItems();

        return (
            <div className="layout-fill">
                {!loaded ? (
                    <AppLoader />
                ) : (
                    <div className="layout-fill column align-stretch">
                        <AppBar
                            className="row align-center"
                            showMenuIconButton={!docked}
                            style={{height: 75}}
                            iconStyleLeft={{marginTop: 0}}
                            title="UQ eSpace"
                            titleStyle={titleStyle}
                            onLeftIconButtonTouchTap={this.toggleDrawer}
                            iconElementRight={
                                <div style={{marginTop: '-10px'}}>
                                    <IconButton iconClassName="material-icons" data-tip="Search" data-for="header" className="AppBarRightButton">search</IconButton>
                                    <IconButton iconClassName="material-icons" data-tip="Sign in" data-for="header" className="AppBarRightButton">person_outline</IconButton>
                                    <IconButton iconClassName="material-icons" data-tip="Help" data-for="header" className="AppBarRightButton">help</IconButton>
                                </div>
                            }
                        />

                        <MenuDrawer menuItems={menuItems}
                                    drawerOpen={docked ? true : menuDrawerOpen}
                                    docked={docked}
                                    toggleDrawer={this.toggleDrawer} />

                        <div className="content-container flex" style={container}>
                            {/* TODO: how to handle different types of users and anonymous accounts */}
                            {account ?
                                (
                                    <Switch>
                                        <Route exact path="/" component={Dashboard} />
                                        <Route path="/research" component={Research} />
                                        <Route path="/add-record" component={AddRecord} />
                                        <Route component={Dashboard} />
                                    </Switch>
                                ) : (
                                    <Switch>
                                        <Route path="/about" component={About} />
                                        <Route path="/browse" component={Browse} />
                                        <Route component={Browse} />
                                    </Switch>
                                )
                            }
                        </div>

                        <Snackbar
                            open={snackbar.get('open')}
                            message={snackbar.get('message')}
                            autoHideDuration={4000}
                            onRequestClose={hideSnackbar} />

                        {/* review HelpDrawer export */}
                        {/*<HelpDrawer />*/}
                        {/*{HelpDrawer}*/}
                    </div>
                )}
            </div>
        );
    }
}
