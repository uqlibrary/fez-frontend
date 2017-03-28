/* eslint-disable */

import React from 'react';
import {Route, Switch} from 'react-router';
import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';

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
        account: React.PropTypes.object.isRequired,
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
                            onLeftIconButtonTouchTap={this.toggleDrawer} />

                        <MenuDrawer menuItems={[...researcherMenuItems(account.get('mail')), ...defaultMenuItems()]}
                                    drawerOpen={docked ? true : menuDrawerOpen}
                                    docked={docked}
                                    toggleDrawer={this.toggleDrawer} />

                        <div className="content-container flex" style={container}>
                            <Switch>
                                <Route exact path="/" component={Dashboard} />
                                <Route path="/research" component={Research} />
                                <Route path="/add-record" component={AddRecord} />
                                <Route path="/browse" component={Browse} />
                                <Route path="/about" component={About} />
                            </Switch>
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
