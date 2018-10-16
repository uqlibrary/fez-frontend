import React, {PureComponent} from 'react';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import TextField from '@material-ui/core/TextField';

const styles = {};

class Admin extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            tabbed: true,
            tabValue: 0
        };
    }

    handleTabChange = (event, value) => {
        this.setState({...this.state, tabValue: value});
    };

    handleFormatChange = () => {
        this.setState({ tabbed: !this.state.tabbed });
    };

    handleKeyEvent = (key) => {
        switch (key) {
            case 'ctrl+shift+left':
                this.state.tabValue > 0 && this.setState({
                    ...this.state,
                    tabValue: this.state.tabValue - 1
                });
                break;
            case 'ctrl+shift+right':
                this.state.tabValue < 5 && this.setState({
                    ...this.state,
                    tabValue: this.state.tabValue + 1
                });
                break;
            case 'ctrl+shift+up':
                this.setState({
                    ...this.state,
                    tabbed: true
                });
                break;
            case 'ctrl+shift+down':
                this.setState({
                    ...this.state,
                    tabbed: false
                });
                break;
            default:
                break;
        }
    };

    render() {
        return (
            <StandardPage title={`Admin form prototype - ${this.state.tabbed ? 'Tabbed ' : 'Form '}:${this.state.tabValue + 1}`}>
                <KeyboardEventHandler
                    handleKeys={['ctrl+shift+left', 'ctrl+shift+right', 'ctrl+shift+up', 'ctrl+shift+down']}
                    onKeyEvent={this.handleKeyEvent}
                    handleFocusableElements
                />
                <Grid container spacing={0} direction={'row'} style={{marginTop: -70}}>
                    <Grid item xs />
                    <Grid item xs={'auto'}>
                        <Grid container direction={'row'} spacing={0} alignItems={'center'}>
                            <Grid item>
                                <Tooltip title={`Switch to ${this.state.tabbed ? 'full form' : 'tabbed'} mode`} placement="left">
                                    <Switch
                                        color={'primary'}
                                        checked={this.state.tabbed}
                                        onChange={this.handleFormatChange}
                                        value="tabbed"
                                    />
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                    {
                        this.state.tabbed ?
                            <Grid item xs={12}>
                                <Tabs value={this.state.tabValue}
                                    onChange={this.handleTabChange}
                                    fullWidth
                                    indicatorColor="primary"
                                    textColor="primary">
                                    <Tab label="Item One"/>
                                    <Tab label="Item Two"/>
                                    <Tab label="Item Three"/>
                                    <Tab label="Item Four"/>
                                    <Tab label="Item Five"/>
                                    <Tab label="Item Six"/>
                                </Tabs>
                            </Grid>
                            :
                            <div style={{height: 80}} />
                    }
                </Grid>
                {/* --------------- Content here ---------------*/}
                <Grid container spacing={24}>
                    {
                        ((this.state.tabbed && this.state.tabValue === 0) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Item 1'}>
                                <TextField
                                    label="Test"
                                    autoFocus={!!this.state.tabbed && this.state.tabValue === 0}
                                    fullWidth
                                />
                                <p>Hold down &lt;CTRL&gt; + &lt;SHIFT&gt; and up, down, left, right to move between tabs, or toggle between tabbed or full form mode</p>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 1) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Item 2'}>
                                <TextField
                                    label="Test"
                                    autoFocus={!!this.state.tabbed && this.state.tabValue === 1}
                                    fullWidth
                                />
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 2) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Item 3'}>
                                <TextField
                                    label="Test"
                                    autoFocus={!!this.state.tabbed && this.state.tabValue === 2}
                                    fullWidth
                                />
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 3) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Item 4'}>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 4) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Item 5'}>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 5) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Item 6'}>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <img src={'https://media3.mensxp.com/media/content/2015/Apr/factseverymanshouldknowaboutbeardsh_1428322950_1100x513.jpg'} style={{width: '100%'}} />
                            </StandardCard>
                        </Grid>
                    }
                </Grid>
            </StandardPage>
        );
    }
}
export default withStyles(styles, {withTheme: true})(Admin);
