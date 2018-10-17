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
import Typography from '@material-ui/core/Typography';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';
import Keyboard from '@material-ui/icons/Keyboard';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';
import withWidth from '@material-ui/core/withWidth';
import Cookies from 'js-cookie';

const styles = theme => ({
    helpIcon: {
        color: theme.palette.secondary.main,
        opacity: 0.66,
        '&:hover': {
            opacity: 0.87
        }
    }
});

class Admin extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object,
        width: PropTypes.any
    };

    constructor(props) {
        super(props);
        this.state = {
            tabbed: Cookies.get('adminFormTabbed') ? !!(Cookies.get('adminFormTabbed') === 'tabbed') : true,
            tabValue: 0
        };
    }

    componentWillMount() {
        if (this.props.width === 'xs') {
            this.setState({
                ...this.state,
                tabbed: false
            });
            Cookies.set('adminFormTabbed', 'fullform');
        }
    }

    handleTabChange = (event, value) => {
        this.setState({...this.state, tabValue: value});
    };

    handleFormatChange = () => {
        this.setState({tabbed: !this.state.tabbed }, () => {
            Cookies.set('adminFormTabbed', this.state.tabbed ? 'tabbed' : 'fullform');
        });
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
        const {classes} = this.props;
        return (
            <StandardPage title={'Admin form prototype'}>
                <Hidden xsDown>
                    <KeyboardEventHandler
                        handleKeys={['ctrl+shift+left', 'ctrl+shift+right', 'ctrl+shift+up', 'ctrl+shift+down']}
                        onKeyEvent={this.handleKeyEvent}
                        handleFocusableElements
                    />
                </Hidden>
                <Hidden xsDown>
                    <Grid container direction={'row'} style={{marginTop: -70}}>
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
                                <Grid item>
                                    <HelpIcon
                                        icon={<Keyboard className={classes.helpIcon} />}
                                        tooltip={'Learn about keyboard shortcuts'}
                                        title={'Keyboard shortcuts'}
                                        text={(
                                            <React.Fragment>
                                                <br/>
                                                <Typography variant={'h6'} component={'p'}>Tab navigation</Typography>
                                                <p>To navigate tabs while in tabbed mode, hold CTRL and SHIFT and use the LEFT and RIGHT arrow keys.</p>
                                                <Typography variant={'h6'} component={'p'}>Form style</Typography>
                                                <p>To switch between tabbed or full form mode, hold CTRL and SHIFT and use the UP and DOWN arrow keys.</p>
                                            </React.Fragment>
                                        )}
                                        buttonLabel={'GOT IT'}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Hidden>
                <Grid container spacing={0} direction={'row'}>
                    {
                        this.state.tabbed ?
                            <Grid item xs={12}>
                                <Tabs value={this.state.tabValue}
                                    style={{marginRight: -56, marginLeft: -56}}
                                    onChange={this.handleTabChange}
                                    scrollable
                                    scrollButtons={'on'}
                                    indicatorColor="primary"
                                    textColor="primary">
                                    <Tab label="General"/>
                                    <Tab label="Contributors"/>
                                    <Tab label="Identifiers"/>
                                    <Tab label="Meta data"/>
                                    <Tab label="Files"/>
                                    <Tab label="Security"/>
                                </Tabs>
                            </Grid>
                            :
                            <div style={{height: 12}} />
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

const AdminWithWidth = withWidth()(Admin);
export default withStyles(styles, {withTheme: true})(AdminWithWidth);
