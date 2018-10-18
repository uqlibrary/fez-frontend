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
import Badge from '@material-ui/core/Badge';
import Cookies from 'js-cookie';

const styles = theme => ({
    helpIcon: {
        color: theme.palette.secondary.main,
        opacity: 0.66,
        '&:hover': {
            opacity: 0.87
        }
    },
    tabIndicator: {
        height: 4,
        backgroundColor: theme.palette.primary.main
    },
    badgeMargin: {
        top: 8,
        left: 28,
        width: 12, height: 12,
        fontSize: 10,
        fontWeight: 'bold',
        backgroundColor: '#595959'
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
        const PIDtitle = 'UQ:12345 Uncoupling of the Pdc-Treg Crosstalk During Early-Life Pneumovirus Infection Underlies Long-Lived Treg Dysfunction and Asthma Development';
        return (
            <StandardPage>
                <Hidden xsDown>
                    <KeyboardEventHandler
                        handleKeys={['ctrl+shift+left', 'ctrl+shift+right', 'ctrl+shift+up', 'ctrl+shift+down']}
                        onKeyEvent={this.handleKeyEvent}
                        handleFocusableElements
                    />
                    <Grid container direction={'row'} alignItems={'center'} style={{marginTop: -24}}>
                        <Grid item xs style={{marginBottom: 12}}>
                            <Typography variant={'h5'} color={'primary'} style={{fontSize: 24}}>{PIDtitle}</Typography>
                        </Grid>
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
                                    <Badge classes={{badge: classes.badgeMargin}} badgeContent={'?'} color="secondary">
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
                                                    <p>Your preference is saved as a cookie on this browser and it will remember your preference.</p>
                                                </React.Fragment>
                                            )}
                                            buttonLabel={'GOT IT'}
                                        />
                                    </Badge>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} direction={'row'}>
                        {
                            this.state.tabbed &&
                                <Grid item xs={12}>
                                    <Tabs value={this.state.tabValue}
                                        style={{marginRight: -56, marginLeft: -56}}
                                        classes={{indicator: classes.tabIndicator}}
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
                        }
                    </Grid>
                </Hidden>
                {/* --------------- Content here ---------------*/}
                <Grid container spacing={16}>
                    <Hidden smUp>
                        <Grid item xs>
                            <Typography variant={'h5'} color={'primary'} style={{fontSize: 24}}>{PIDtitle}</Typography>
                        </Grid>
                    </Hidden>
                    {
                        ((this.state.tabbed && this.state.tabValue === 0) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'General'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 0}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test2"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test3"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test4"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test5"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test6"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test7"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 1) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Contributors'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 1}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test2"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test3"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test4"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 2) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Identifiers'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 2}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test2"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test3"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test4"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test5"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test6"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 3) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Meta data'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 3}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test2"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test3"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test4"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test5"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test6"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 4) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Files'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 4}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 5) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Security'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test"
                                            autoFocus={!!this.state.tabbed && this.state.tabValue === 5}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test2"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Test3"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test4"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test5"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test6"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test5"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test6"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test5"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Test6"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
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
