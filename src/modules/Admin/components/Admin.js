import React, {PureComponent} from 'react';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';

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

    render() {
        return (
            <StandardPage title={`Admin form prototype - ${this.state.tabbed ? 'Tabbed ' : 'Form '}:${this.state.tabValue + 1}`}>
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
                        this.state.tabbed &&
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
                    }
                </Grid>
                {/* --------------- Content here ---------------*/}
                <Grid container spacing={24}>
                    {
                        ((this.state.tabbed && this.state.tabValue === 0) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Item 1'}>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                            </StandardCard>
                        </Grid>
                    }
                    {
                        ((this.state.tabbed && this.state.tabValue === 1) || !this.state.tabbed) &&
                        <Grid item xs={12}>
                            <StandardCard title={'Item 2'}>
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
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tellus ipsum, ullamcorper ac enim et, tempus posuere enim. Nam dui ex, gravida vel magna consequat, vehicula scelerisque ex. Proin tellus ipsum, malesuada vitae sapien non, efficitur rutrum lacus. Nam sapien sem, pharetra ac enim vitae, rhoncus tincidunt lectus. Maecenas eget sapien nec arcu semper ornare. Vestibulum facilisis a nisi a interdum. Quisque mollis ipsum augue, vitae fringilla urna dictum eget.</p>
                            </StandardCard>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        {JSON.stringify(this.state)}
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
}
export default withStyles(styles, {withTheme: true})(Admin);
