import React, {/* Component, */ useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { Field } from 'redux-form/immutable';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';

import FormViewToggler from './FormViewToggler';
import IdentifiersSection from './IdentifiersSection';
import BibliographicSection from './BibliographicSection';
import AdminSection from './AdminSection';
import GrantInformationSection from './GrantInformationSection';
import SecuritySection from './security/SecuritySectionContainer';
import TabContainer from './TabContainer';
import {
    useTabbedContext,
    useRecordContext
} from 'context';

import pageLocale from 'locale/pages';

const queryString = require('query-string');

function useQueryStringTabValueState(location, initialValue = 0) {
    const tabValue = queryString.parse(location.search, { ignoreQueryPrefix: true }).tab === 'security' && 6 || initialValue;
    return useState(tabValue);
}

export const AdminInterface = ({ classes, submitting, handleSubmit, location }) => {
    const { record } = useRecordContext();
    const { tabbed } = useTabbedContext();
    const [currentTabValue, setCurrentTabValue] = useQueryStringTabValueState(location);
    useEffect(() => {
        Cookies.set('adminFormTabbed', tabbed ? 'tabbed' : 'fullform');
    }, [tabbed]);

    const handleTabChange = (event, value) => setCurrentTabValue(value);

    const txt = pageLocale.pages.edit;

    return (
        <StandardPage>
            <React.Fragment>
                <Grid container direction="row" alignItems="center" style={{marginTop: -24}}>
                    <Grid item xs style={{marginBottom: 12}}>
                        <Typography variant="h5" color="primary" style={{fontSize: 24}}>{`${record.rek_pid} ${record.rek_title}`}</Typography>
                    </Grid>
                    <Hidden xsDown>
                        <Grid item xs="auto">
                            <FormViewToggler/>
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
                                            <Tab label={txt.sections.identifiers.title} />
                                            <Tab label={txt.sections.bibliographic.title} />
                                            <Tab label={txt.sections.admin.title} />
                                            <Tab label={txt.sections.grantInformation.title} />
                                            <Tab label={txt.sections.authorDetails.title} />
                                            <Tab label={txt.sections.files.title} />
                                            <Tab label={txt.sections.security.title} />
                                        </Tabs>
                                    </Grid>
                            }
                        </Grid>
                    </Hidden>
                </Grid>
                {/* --------------- Content here ---------------*/}
                <form>
                    <Grid container spacing={16}>
                        <TabContainer value={0} currentTab={currentTabValue} tabbed={tabbed}>
                            <StandardCard title={txt.sections.identifiers.title} primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                <IdentifiersSection
                                    disabled={submitting}
                                />
                            </StandardCard>
                        </TabContainer>
                        <TabContainer value={1} currentTab={currentTabValue} tabbed={tabbed}>
                            <StandardCard title={txt.sections.bibliographic.title} primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                <BibliographicSection
                                    disabled={submitting}
                                />
                            </StandardCard>
                        </TabContainer>
                        <TabContainer value={2} currentTab={currentTabValue} tabbed={tabbed}>
                            <StandardCard title={txt.sections.admin.title} primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                <AdminSection disabled={submitting}/>
                            </StandardCard>
                        </TabContainer>
                        <TabContainer value={3} currentTab={currentTabValue} tabbed={tabbed}>
                            <StandardCard title={txt.sections.grantInformation.title} primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                <GrantInformationSection disabled={submitting}/>
                            </StandardCard>
                        </TabContainer>
                        <TabContainer value={4} currentTab={currentTabValue} tabbed={tabbed}>
                            <StandardCard title={txt.sections.authorDetails.title} primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                Author details
                            </StandardCard>
                        </TabContainer>
                        <TabContainer value={5} currentTab={currentTabValue} tabbed={tabbed}>
                            <StandardCard title={txt.sections.files.title} primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                Files
                            </StandardCard>
                        </TabContainer>
                        <TabContainer value={6} currentTab={currentTabValue} tabbed={tabbed}>
                            <StandardCard title={txt.sections.security.title} primaryHeader={!!tabbed} squareTop={!!tabbed}>
                                <Field
                                    component={SecuritySection}
                                    disabled={submitting}
                                    name="securitySection"
                                />
                            </StandardCard>
                        </TabContainer>
                        <Grid item xs={12} sm={12}>
                            <Button
                                style={{whiteSpace: 'nowrap'}}
                                variant="contained"
                                color="primary"
                                fullWidth
                                children="Submit"
                                onClick={handleSubmit}
                            />
                        </Grid>
                    </Grid>
                </form>
            </React.Fragment>
        </StandardPage>
    );
};

AdminInterface.propTypes = {
    classes: PropTypes.object,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    location: PropTypes.object,
};

// class Admin extends Component {
//     static propTypes = {
//         loadingRecordToView: PropTypes.bool,
//         recordToView: PropTypes.object,
//         actions: PropTypes.object,
//         location: PropTypes.object,
//         classes: PropTypes.object,
//         theme: PropTypes.object,
//         submitting: PropTypes.any,
//         disableSubmit: PropTypes.any,
//         formValues: PropTypes.any,
//         tabbed: PropTypes.bool,
//         handleSubmit: PropTypes.func,
//         match: PropTypes.object
//     };

//     constructor(props) {
//         super(props);
//         let queryStringTabValue = 0;
//         switch (queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).tab) {
//             case 'security':
//                 queryStringTabValue = 6;
//                 break;
//             default:
//                 queryStringTabValue = 0;
//         }
//         this.state = {
//             tabValue: queryStringTabValue,
//             grants: {
//                 showEdit: false,
//                 showAdd: false,
//                 buttonAction: 'Add new item'
//             },
//             overrideSecurity: false,
//             overrideDatastreamSecurity: false
//         };
//     }

//     componentDidMount() {
//         if (!!this.props.match.params.pid && !!this.props.actions.loadRecordToView) {
//             this.props.actions.loadRecordToView(this.props.match.params.pid);
//         }
//     }

//     render() {
//         const txt = locale.pages.edit;
//         const {loadingRecordToView, recordToView} = this.props;
//         if(loadingRecordToView) {
//             return <InlineLoader message={txt.loadingMessage}/>;
//         } else if(!recordToView) {
//             return <div className="empty"/>;
//         }

//         return (
//             <FormValuesContextProvider value={{formValues: this.props.formValues.toJS()}}>
//                 {
//                     !!this.props.recordToView &&
//                     <RecordContextProvider value={{record: this.props.recordToView}}>
//                         <AdminInterface
//                             classes={this.props.classes}
//                             isTabbed={this.props.tabbed}
//                             handleSubmit={this.props.handleSubmit}
//                             record={this.props.recordToView}
//                         />
//                     </RecordContextProvider>
//                 }
//             </FormValuesContextProvider>
//         );

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
//     }
// }

export default React.memo(AdminInterface);

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
