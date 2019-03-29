import React, {Component, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import locale from 'locale/pages';

import useTheme from '@material-ui/styles/useTheme';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Badge from '@material-ui/core/Badge';
import Keyboard from '@material-ui/icons/Keyboard';
import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';

import FormViewToggler from './FormViewToggler';
import IdentifiersSection from './IdentifiersSection';
import BibliographicSection from './BibliographicSection';
import AdminSection from './AdminSection';
import GrantInformationSection from './GrantInformationSection';
import SecuritySection from './SecuritySection';
import TabContainer from './TabContainer';
import {
    TabbedContextProvider,
    TabbedContextConsumer,
    FormValuesContextProvider,
    RecordContextProvider,
    RecordContextConsumer
} from 'context';

const queryString = require('query-string');

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

export function AdminInterface({ classes, submitting, isTabbed, handleSubmit }) {
    const [tabbed, setTabbed] = useState(isTabbed);
    const [currentTabValue, setCurrentTabValue] = useState(0);
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('xs')) || false;
    const handleToggle = () => setTabbed(!tabbed);
    useEffect(() => {
        Cookies.set('adminFormTabbed', tabbed ? 'tabbed' : 'fullform');
    }, [tabbed]);

    const handleTabChange = (event, value) => setCurrentTabValue(value);
    // const authorRecColumns = [
    //     {
    //         name: 'Author name',
    //         options: {
    //             display: true,
    //             sort: true,
    //         }
    //     },
    //     {
    //         name: 'Author UQ ID',
    //         options: {
    //             display: true,
    //             sort: true,
    //         }
    //     },
    //     {
    //         name: 'Affiliation %',
    //         options: {
    //             display: true,
    //             sort: true,
    //         }
    //     },
    //     {
    //         name: '',
    //         options: {
    //             display: true,
    //             sort: false,
    //             filter: false
    //         }
    //     }
    // ];
    // const authorRecData = [
    //     ['John Smith', 'UQ12345', <TextField
    //         fullWidth
    //         placeholder="1% - 100%"
    //         autoComplete="off"
    //     />, <IconButton style={{float: 'right', marginRight: -24}}><PersonAdd/></IconButton>]
    // ];
    // const authorRecOptions = {
    //     sort: false,
    //     filter: false,
    //     search: false,
    //     print: false,
    //     download: false,
    //     viewColumns: false,
    //     selectableRows: false,
    //     rowHover: false,
    //     customToolbar: () => <div />
    // };


    return (
        <StandardPage>
            <TabbedContextProvider value={{tabbed: isMobileView ? false : tabbed, toggleTabbed: handleToggle}}>
                <RecordContextConsumer>
                    {
                        ({record}) => (
                            <React.Fragment>
                                <Grid container direction="row" alignItems="center" style={{marginTop: -24}}>
                                    <Grid item xs style={{marginBottom: 12}}>
                                        <Typography variant="h5" color="primary" style={{fontSize: 24}}>{`${record.rek_pid} ${record.rek_title}`}</Typography>
                                    </Grid>
                                    <Hidden xsDown>
                                        <Grid item xs="auto">
                                            <Grid container direction="row" spacing={0} alignItems="center">
                                                <Grid item>
                                                    <FormViewToggler/>
                                                </Grid>
                                                <Grid item>
                                                    <Badge classes={{badge: classes.badgeMargin}} badgeContent="?" color="secondary">
                                                        <HelpIcon
                                                            icon={<Keyboard className={classes.helpIcon} />}
                                                            tooltip="Learn about keyboard shortcuts"
                                                            title="Keyboard shortcuts"
                                                            text={(
                                                                <React.Fragment>
                                                                    <br/>
                                                                    <Typography variant="h6" component="p">Tab navigation</Typography>
                                                                    <p>To navigate tabs while in tabbed mode, hold CTRL and SHIFT and use the LEFT and RIGHT arrow keys.</p>
                                                                    <Typography variant="h6" component="p">Form style</Typography>
                                                                    <p>To switch between tabbed or full form mode, hold CTRL and SHIFT and use the UP and DOWN arrow keys.</p>
                                                                    <p>Your preference is saved as a cookie on this browser and it will remember your preference.</p>
                                                                </React.Fragment>
                                                            )}
                                                            buttonLabel="GOT IT"
                                                        />
                                                    </Badge>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={0} direction="row">
                                            {
                                                tabbed &&
                                                    <Grid item xs={12}>
                                                        <Tabs value={currentTabValue}
                                                            variant="fullWidth"
                                                            style={{marginRight: -56, marginLeft: -56}}
                                                            classes={{indicator: classes.tabIndicator}}
                                                            onChange={handleTabChange}
                                                            variant="scrollable"
                                                            scrollButtons="on"
                                                            indicatorColor="primary"
                                                            textColor="primary">
                                                            <Tab label="Identifiers"/>
                                                            <Tab label="Bibliographic"/>
                                                            <Tab label="Admin"/>
                                                            <Tab label="Grant Information"/>
                                                            <Tab label="Author details"/>
                                                            <Tab label="Files"/>
                                                            <Tab label="Security"/>
                                                        </Tabs>
                                                    </Grid>
                                            }
                                        </Grid>
                                    </Hidden>
                                </Grid>
                                {/* --------------- Content here ---------------*/}
                                <TabbedContextConsumer>
                                    {
                                        ({tabbed}) => (
                                            <form>
                                                <Grid container spacing={16}>
                                                    <TabContainer value={0} currentTab={currentTabValue} tabbed={(tabbed && !isMobileView)}>
                                                        <StandardCard title="Identifiers" primaryHeader={!!(tabbed && !isMobileView)} squareTop={!!(tabbed && !isMobileView)}>
                                                            <IdentifiersSection
                                                                disabled={submitting}
                                                            />
                                                        </StandardCard>
                                                    </TabContainer>
                                                    <TabContainer value={1} currentTab={currentTabValue} tabbed={(tabbed && !isMobileView)}>
                                                        <StandardCard title="Bibliographic" primaryHeader={!!(tabbed && !isMobileView)} squareTop={!!(tabbed && !isMobileView)}>
                                                            <BibliographicSection
                                                                disabled={submitting}
                                                            />
                                                        </StandardCard>
                                                    </TabContainer>
                                                    <TabContainer value={2} currentTab={currentTabValue} tabbed={tabbed}>
                                                        <StandardCard title="Admin" primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                                            <AdminSection disabled={submitting}/>
                                                        </StandardCard>
                                                    </TabContainer>
                                                    <TabContainer value={3} currentTab={currentTabValue} tabbed={tabbed}>
                                                        <StandardCard title="Grant Information" primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                                            <GrantInformationSection disabled={submitting}/>
                                                        </StandardCard>
                                                    </TabContainer>
                                                    <TabContainer value={4} currentTab={currentTabValue} tabbed={tabbed}>
                                                        <StandardCard title="Author details" primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                                            Author details
                                                        </StandardCard>
                                                    </TabContainer>
                                                    <TabContainer value={5} currentTab={currentTabValue} tabbed={tabbed}>
                                                        <StandardCard title="Files" primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                                            Files
                                                        </StandardCard>
                                                    </TabContainer>
                                                    <TabContainer value={6} currentTab={currentTabValue} tabbed={tabbed}>
                                                        <StandardCard title="Security" primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                                            <SecuritySection disabled={submitting} handleSubmit={handleSubmit} recordType={record.rek_object_type_lookup || record.rek_display_type_lookup}/>
                                                        </StandardCard>
                                                    </TabContainer>
                                                </Grid>
                                            </form>
                                        )
                                    }
                                </TabbedContextConsumer>
                            </React.Fragment>
                        )
                    }
                </RecordContextConsumer>
            </TabbedContextProvider>
        </StandardPage>
    );
}

AdminInterface.propTypes = {
    classes: PropTypes.object,
    submitting: PropTypes.bool,
    isTabbed: PropTypes.bool,
    handleSubmit: PropTypes.func,
    record: PropTypes.object
};

class Admin extends Component {
    static propTypes = {
        loadingRecordToView: PropTypes.bool,
        recordToView: PropTypes.object,
        actions: PropTypes.object,
        location: PropTypes.object,
        classes: PropTypes.object,
        theme: PropTypes.object,
        submitting: PropTypes.any,
        disableSubmit: PropTypes.any,
        formValues: PropTypes.any,
        tabbed: PropTypes.bool,
        handleSubmit: PropTypes.func,
        match: PropTypes.object
    };

    constructor(props) {
        super(props);
        let queryStringTabValue = 0;
        switch (queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).tab) {
            case 'security':
                queryStringTabValue = 6;
                break;
            default:
                queryStringTabValue = 0;
        }
        this.state = {
            tabValue: queryStringTabValue,
            grants: {
                showEdit: false,
                showAdd: false,
                buttonAction: 'Add new item'
            },
            overrideSecurity: false,
            overrideDatastreamSecurity: false
        };
    }

    componentDidMount() {
        if (!!this.props.match.params.pid && !!this.props.actions.loadRecordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    render() {
        const txt = locale.pages.edit;
        const {loadingRecordToView, recordToView} = this.props;
        if(loadingRecordToView) {
            return <InlineLoader message={txt.loadingMessage}/>;
        } else if(!recordToView) {
            return <div className="empty"/>;
        }

        return (
            <FormValuesContextProvider value={{formValues: this.props.formValues}}>
                {
                    !!this.props.recordToView &&
                    <RecordContextProvider value={{record: this.props.recordToView}}>
                        <AdminInterface
                            classes={this.props.classes}
                            isTabbed={this.props.tabbed}
                            handleSubmit={this.props.handleSubmit}
                            record={this.props.recordToView}
                        />
                    </RecordContextProvider>
                }
            </FormValuesContextProvider>
        );

        // return (
        //     <form>
        //         <StandardPage>
        //             {/* --------------- Content here ---------------*/}
        //             <Grid container spacing={16}>
        //                 {
        //                     ((this.state.tabbed && this.state.tabValue === 4) || !this.state.tabbed) &&
        //                     // Authors
        //                     <React.Fragment>
        //                         <Grid item xs={12}>
        //                             <StandardCard title="Author detail" primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
        //                                 <Field
        //                                     component={ContributorsEditorField}
        //                                     showIdentifierLookup
        //                                     name="authoraffiliation"
        //                                     locale={{
        //                                         errorTitle: 'Error',
        //                                         errorMessage: 'Unable to add an item with the same identifier.',
        //                                         form: {
        //                                             locale: {
        //                                                 nameAsPublishedLabel: 'Author name',
        //                                                 nameAsPublishedHint: '',
        //                                                 identifierLabel: 'UQ identifier (if available)',
        //                                                 descriptionStep1NoStep2: 'Enter each author and add affiliation data to each.',
        //                                                 addButton: <span>Add&nbsp;affiliation</span>
        //                                             }
        //                                         }
        //                                     }}
        //                                 />
        //                             </StandardCard>
        //                         </Grid>
        //                         <Grid item xs={12}>
        //                             <StandardCard title="Author affiliation recommendations">
        //                                 <MUIDataTable
        //                                     data={authorRecData}
        //                                     columns={authorRecColumns}
        //                                     options={authorRecOptions}
        //                                 />
        //                             </StandardCard>
        //                         </Grid>
        //                     </React.Fragment>
        //                 }
        //                 {
        //                     ((this.state.tabbed && this.state.tabValue === 5) || !this.state.tabbed) &&
        //                     // Files
        //                     <Grid item xs={12}>
        //                         <StandardCard title="Files" primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
        //                             <Grid container spacing={16}>
        //                                 <Grid item xs={12} sm={12}>
        //                                     <Typography variant="body2" component="p">Some explanatory text might go here. It may not. Time will tell.</Typography>
        //                                 </Grid>
        //                             </Grid>
        //                             <Grid item xs={12}>
        //                                 <Field
        //                                     name="files"
        //                                     component={ FileUploadField }
        //                                     requireOpenAccessStatus
        //                                     validate={[validation.validFileUpload]} />
        //                             </Grid>
        //                         </StandardCard>
        //                     </Grid>
        //                 }
        //             </Grid>
        //         </StandardPage>
        //     </form>
        // );
    }
}

export default withStyles(styles, {withTheme: true})(Admin);
