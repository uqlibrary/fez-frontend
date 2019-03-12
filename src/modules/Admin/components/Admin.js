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
import {TextField as GenericTextField} from '../../SharedComponents/Toolbox/TextField';
import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';
import Hidden from '@material-ui/core/Hidden';
import Keyboard from '@material-ui/icons/Keyboard';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';
import withWidth from '@material-ui/core/withWidth';
import Badge from '@material-ui/core/Badge';
import DownshiftMultiple from 'modules/Admin/components/MultiSelectWithChip';
import MenuItem from '@material-ui/core/MenuItem';
import {RichEditorField} from 'modules/SharedComponents/RichEditor';
import DatePicker from 'material-ui-pickers/DatePicker';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Event from '@material-ui/icons/Event';
import moment from 'moment';
import Cookies from 'js-cookie';
import {validation} from 'config';
import {Field} from 'redux-form/lib/immutable';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';
import {PIDtitle, collectionItems, subjects, WOSDocTypes, ScopusDocTypes, PubmedDocTypes, subtypes, languages, refereedsources, openaccess, qindex} from './MockData';
import Button from '@material-ui/core/Button';
import MUIDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import PersonAdd from '@material-ui/icons/PersonAdd';
import {FileUploadField} from 'modules/SharedComponents/Toolbox/FileUploader';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import TextField from '@material-ui/core/TextField';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
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

class Admin extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        author: PropTypes.object,
        actions: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object,
        classes: PropTypes.object,
        width: PropTypes.any,
        theme: PropTypes.object,
        submitting: PropTypes.any,
        disableSubmit: PropTypes.any,
        formValues: PropTypes.any
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
            tabbed: Cookies.get('adminFormTabbed') ? !!(Cookies.get('adminFormTabbed') === 'tabbed') : true,
            tabValue: queryStringTabValue,
            grants: {
                showEdit: false,
                showAdd: false,
                buttonAction: 'Add new item'
            },
            overrideSecurity: false
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

    handleMultiChipData = (name, data) => {
        this.setState({
            [name]: data
        });
    };

    handleDatePicker = event => {
        this.setState({
            ...this.state,
            pubDate: moment(event).format()
        });
    };

    handleGrantEditButton = () => {
        this.setState({
            ...this.state,
            grants: {
                ...this.state.grants,
                buttonAction: 'Update this item'
            }
        });
    }

    toggleSecurityOverride = () => {
        this.setState({
            ...this.state,
            overrideSecurity: !this.state.overrideSecurity
        });
    }

    toggleSecurityOverride2 = () => {
        this.setState({
            ...this.state,
            overrideSecurity2: !this.state.overrideSecurity2
        });
    }

    handleGrantEditButtonSubmit = () => {
        this.setState({
            ...this.state,
            grants: {
                ...this.state.grants,
                buttonAction: 'Add new item'
            }
        });
    }

    findWithAttr = (array, attr, value) => {
        for(let i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    };

    render() {
        const { classes } = this.props;
        const grantColumns = [
            {
                name: 'Grant agency',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: 'Grant agency ID',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: 'Grant ID',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: 'Grant acronym',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: 'Grant text',
                options: {
                    display: 'false',
                    sort: true,
                }
            },
            {
                name: 'Actions',
                options: {
                    display: true,
                    sort: false,
                    filter: false
                }
            }];
        const grantData = [
            ['National Breast Cancer Foundation of Australia', 'NBCF: 2007003445', '1234', 'NBCF', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec ligula nec nulla sodales laoreet.', <IconButton onClick={this.handleGrantEditButton}><Edit/></IconButton>],
            ['Australian Research Council', 'ARC: DP0985025', '1234', 'NBCF', 'Gravida lectus quis, fermentum dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec quis interdum leo.', <IconButton onClick={this.handleGrantEditButton}><Edit/></IconButton>],
        ];
        const grantOptions = {
            filterType: 'checkbox',
        };

        const authorRecColumns = [
            {
                name: 'Author name',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: 'Author UQ ID',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: 'Affiliation %',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: '',
                options: {
                    display: true,
                    sort: false,
                    filter: false
                }
            }
        ];
        const authorRecData = [
            ['John Smith', 'UQ12345', <TextField
                fullWidth
                placeholder="1% - 100%"
                autoComplete="off"
            />, <IconButton style={{float: 'right', marginRight: -24}}><PersonAdd/></IconButton>]
        ];
        const authorRecOptions = {
            sort: false,
            filter: false,
            search: false,
            print: false,
            download: false,
            viewColumns: false,
            selectableRows: false,
            rowHover: false,
            customToolbar: () => <div />
        };

        const communitySecurity = [
            {value: 'A', label: 'Policy A', id: 'PolicyAID', name: 'Policy A', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam rhoncus congue consectetur. Aenean sed sapien ipsum. Sed lectus mauris, mollis et dolor vitae, rutrum lobortis risus. Aenean a nisl non felis pretium tincidunt id sit amet augue. Aenean ac quam non libero malesuada vulputate. Integer commodo lacus quis egestas varius. Etiam dapibus mollis feugiat. Aliquam pellentesque nunc ac libero feugiat laoreet. In hac habitasse platea dictumst. Duis sagittis lorem id vestibulum maximus. Nullam vel libero eu eros faucibus venenatis. Vestibulum interdum porttitor ipsum sed fringilla. Sed enim lacus, faucibus vel tincidunt euismod, euismod vitae turpis.'},
            {value: 'B', label: 'Policy B', id: 'PolicyBID', name: 'Policy B', description: 'Suspendisse pellentesque libero eget molestie vehicula. Vestibulum eget purus euismod, imperdiet massa non, vulputate lectus. Sed mi mi, placerat ultricies purus nec, sollicitudin fringilla odio. Aliquam erat volutpat. Vestibulum at augue sed arcu condimentum finibus id et dolor.'},
            {value: 'C', label: 'Policy C', id: 'PolicyCID', name: 'Policy C', description: 'Mauris pulvinar tortor eu lectus facilisis, ut ultricies risus elementum. Aenean ac sem quis enim molestie egestas ut id sem. Nulla nibh elit, efficitur fermentum nisl et, semper ultrices quam. Aenean in sollicitudin mi. Cras ultricies eros quis maximus pellentesque. Mauris justo mi, aliquet vitae nisl et, tristique pulvinar risus.'},
        ];

        console.log(queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).tab);

        return (
            <form>
                <StandardPage>
                    <Grid container direction="row" alignItems="center" style={{marginTop: -24}}>
                        <Grid item xs style={{marginBottom: 12}}>
                            <Typography variant="h5" color="primary" style={{fontSize: 24}}>{PIDtitle}</Typography>
                        </Grid>
                        <Hidden xsDown>
                            <KeyboardEventHandler
                                handleKeys={['ctrl+shift+left', 'ctrl+shift+right', 'ctrl+shift+up', 'ctrl+shift+down']}
                                onKeyEvent={this.handleKeyEvent}
                                handleFocusableElements
                            />
                            <Grid item xs="auto">
                                <Grid container direction="row" spacing={0} alignItems="center">
                                    <Grid item>
                                        <Tooltip title={`Switch to ${this.state.tabbed ? 'full form' : 'tabbed'} mode`}>
                                            <Switch
                                                color="primary"
                                                checked={this.state.tabbed}
                                                onChange={this.handleFormatChange}
                                                value="tabbed"
                                            />
                                        </Tooltip>
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
                                    this.state.tabbed &&
                                        <Grid item xs={12}>
                                            <Tabs value={this.state.tabValue}
                                                fullWidth
                                                style={{marginRight: -56, marginLeft: -56}}
                                                classes={{indicator: classes.tabIndicator}}
                                                onChange={this.handleTabChange}
                                                scrollable
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
                    <Grid container spacing={16}>
                        {
                            ((this.state.tabbed && this.state.tabValue === 0) || !this.state.tabbed) &&
                            // Identifiers
                            <Grid item xs={12}>
                                <StandardCard title="Identifiers" primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant="body2" component="p">Some explanatory text might go here. It may not. Time will tell.</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <DownshiftMultiple
                                                initialValue={this.state.collection}
                                                sendData={this.handleMultiChipData}
                                                label="Collection"
                                                placeholder="Begin typing to select and add collection(s)"
                                                optionsList={collectionItems}
                                                name="collection" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="WOSisi"
                                                fullWidth
                                                label="WOS ID (ISI Loc)"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="wosDocType"
                                                value={this.props.formValues.get('wosDocType')}
                                                label="WOS Document type"
                                                required
                                                placeholder="">
                                                <MenuItem value="" disabled>Select a document type</MenuItem>
                                                {WOSDocTypes.map((item, index) => {
                                                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                })}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="scopusId"
                                                fullWidth
                                                label="Scopus ID"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="scopusDocType"
                                                value={this.props.formValues.get('scopusDocType')}
                                                label="Scopus Document type"
                                                required
                                                placeholder="">
                                                <MenuItem value="" disabled>Select a document type</MenuItem>
                                                {ScopusDocTypes.map((item, index) => {
                                                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                })}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="pubmedId"
                                                fullWidth
                                                label="PubMed ID"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="pubmedDocType"
                                                value={this.props.formValues.get('pubmedDocType')}
                                                label="PubMed Document type"
                                                required
                                                placeholder="">
                                                <MenuItem value="" disabled>Select a document type</MenuItem>
                                                {PubmedDocTypes.map((item, index) => {
                                                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                })}
                                            </Field>
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {
                            ((this.state.tabbed && this.state.tabValue === 1) || !this.state.tabbed) &&
                            // Bibliographic
                            <Grid item xs={12}>
                                <StandardCard title="Bibliographic" primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" component="span" style={{opacity: 0.66}}>Formatted title</Typography>
                                            <Field
                                                component={RichEditorField}
                                                name="title"
                                                height={100}
                                                validate={[validation.required]}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={GenericTextField}
                                                name="authorAffiliationAddress"
                                                fullWidth
                                                label="Author affiliation full address"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="language"
                                                value={this.props.formValues.get('language')}
                                                label="Language"
                                                required
                                                placeholder="">
                                                <MenuItem value="" disabled>Please select a language</MenuItem>
                                                {
                                                    languages.map((item, index) =>{
                                                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                    })
                                                }
                                            </Field>
                                        </Grid>


                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="nativeTitle"
                                                fullWidth
                                                label="Native title"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="romanScriptTitle"
                                                fullWidth
                                                label="Roman script title"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="translatedTitle"
                                                fullWidth
                                                label="Translated title"
                                                placeholder="" />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="journalName"
                                                fullWidth
                                                label="Journal name"
                                                placeholder=""
                                                required
                                                validate={[validation.required]}/>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="ISSN"
                                                fullWidth
                                                label="ISSN"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="ISBN"
                                                fullWidth
                                                label="ISBN"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="pubplace"
                                                fullWidth
                                                label="Place of publication"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="publisher"
                                                fullWidth
                                                label="Publisher"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="eraJournal"
                                                fullWidth
                                                label="ERA journal list match"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="eraJournalId"
                                                fullWidth
                                                label="ERA journal ID"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                fullWidth
                                                value={this.state.pubDate}
                                                onChange={this.handleDatePicker}
                                                keyboard
                                                allowKeyboardControl
                                                autoOk
                                                leftArrowIcon={<KeyboardArrowLeft/>}
                                                rightArrowIcon={<KeyboardArrowRight/>}
                                                keyboardIcon={<Event/>}
                                                label="Publication date"

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="subtype"
                                                value={this.props.formValues.get('subtype')}
                                                label="eSpace subtype"
                                                required
                                                placeholder="">
                                                <MenuItem value="" disabled>Select a document subtype</MenuItem>
                                                {
                                                    subtypes.map((item, index) => {
                                                        return  <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                    })}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={8}>
                                            <Field
                                                component={GenericTextField}
                                                name="doi"
                                                fullWidth
                                                label="DOI"
                                                placeholder=""
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="doiembargodays"
                                                fullWidth
                                                label="DOI Embargo days"
                                                placeholder="" />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="volume"
                                                fullWidth
                                                label="Volume"
                                                placeholder="" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="issue"
                                                fullWidth
                                                label="Issue"
                                                placeholder="" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="articlenumber"
                                                fullWidth
                                                label="Article number"
                                                placeholder="" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="startpage"
                                                fullWidth
                                                label="Start page"
                                                placeholder="" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="endpage"
                                                fullWidth
                                                label="End page"
                                                placeholder="" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="totalpages"
                                                fullWidth
                                                label="Total pages"
                                                placeholder="" />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <DownshiftMultiple
                                                initialValue={this.state.subject}
                                                sendData={this.handleMultiChipData}
                                                label="Subject(s)"
                                                placeholder="Begin typing to select and add subject(s)"
                                                optionsList={subjects}
                                                name="subject" />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Field
                                                component={ListEditorField}
                                                name="keywords"
                                                remindToAdd
                                                maxCount={10}
                                                searchKey={{value: 'keyword', order: 'order'}}
                                                value="hello"
                                                // value={this.props.formValues.get('keywords')}
                                                locale={{
                                                    form: {
                                                        locale: {
                                                            inputFieldLabel: 'Keywords',
                                                            inputFieldHint: 'Type keywords',
                                                            addButtonLabel: 'Add'
                                                        }
                                                    }
                                                }} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="caption" component="span" style={{opacity: 0.66}}>Formatted abstract</Typography>
                                            <Field
                                                component={RichEditorField}
                                                name="abstract"
                                                height={100}
                                                validate={[validation.required]}/>
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {
                            ((this.state.tabbed && this.state.tabValue === 2) || !this.state.tabbed) &&
                            // Admin
                            <Grid item xs={12}>
                                <StandardCard title="Admin" primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant="body2" component="p">Some explanatory text might go here. It may not. Time will tell.</Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={SelectField}
                                                name="refsource"
                                                value={this.props.formValues.get('refsource')}
                                                label="Refereed Source"
                                                required
                                                placeholder="">
                                                <MenuItem value="" disabled>Please select a source</MenuItem>
                                                {
                                                    refereedsources.map((item, index) =>{
                                                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={SelectField}
                                                name="openaccessstatus"
                                                value={this.props.formValues.get('openaccessstatus')}
                                                label="Open access status"
                                                required
                                                placeholder="">
                                                <MenuItem value="" disabled>Please select a status</MenuItem>
                                                {
                                                    openaccess.map((item, index) =>{
                                                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                    })
                                                }
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="succeeds"
                                                fullWidth
                                                label="Succeeds"
                                                placeholder="PID of succeeded record" />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={SelectField}
                                                name="qindexcode"
                                                value={this.props.formValues.get('qindexcode')}
                                                label="Research Code (Q-Index code)"
                                                required
                                                placeholder="">
                                                <MenuItem value="" disabled>Please select a code</MenuItem>
                                                {
                                                    qindex.map((item, index) =>{
                                                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                    })
                                                }
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={SelectField}
                                                name="qindexcodestatus"
                                                value={this.props.formValues.get('qindexcodestatus')}
                                                label="Research Code status"
                                                required
                                                placeholder="">
                                                <MenuItem value="" disabled>Please select a status</MenuItem>
                                                <MenuItem value={1} >Confirmed code</MenuItem>
                                                <MenuItem value={2} >Provisional code</MenuItem>
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={SelectField}
                                                name="inststatus"
                                                value={this.props.formValues.get('inststatus')}
                                                label="Institutional status"
                                                placeholder="">
                                                <MenuItem value="" disabled>Please select a status</MenuItem>
                                                <MenuItem value={1} >UQ</MenuItem>
                                                <MenuItem value={2} >Non-UQ</MenuItem>
                                                <MenuItem value={3} >Unknown</MenuItem>
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="caption" component="span" style={{opacity: 0.66}}>Additional notes</Typography>
                                            <Field
                                                component={RichEditorField}
                                                name="notes"
                                                height={100}
                                                validate={[validation.required]}/>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="caption" component="span" style={{opacity: 0.66}}>Internal notes</Typography>
                                            <Field
                                                component={RichEditorField}
                                                name="internalnotes"
                                                height={100}
                                                validate={[validation.required]}/>
                                        </Grid>


                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {
                            ((this.state.tabbed && this.state.tabValue === 3) || !this.state.tabbed) &&
                            // Grant Info
                            <React.Fragment>
                                <Grid item xs={12}>
                                    <StandardCard title="Grant information" primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                        <Grid container spacing={8} style={{marginTop: -24}}>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    component={GenericTextField}
                                                    name="grantagency"
                                                    fullWidth
                                                    label="Grant agency"
                                                    placeholder="" />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    component={GenericTextField}
                                                    name="grantagencyid"
                                                    fullWidth
                                                    label="Grant agency ID"
                                                    placeholder="" />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    component={GenericTextField}
                                                    name="grantid"
                                                    fullWidth
                                                    label="Grant ID"
                                                    placeholder="" />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    component={GenericTextField}
                                                    name="grantacronym"
                                                    fullWidth
                                                    label="Grant acronym"
                                                    placeholder="" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" component="span" style={{opacity: 0.66}}>Grant text</Typography>
                                                <Field
                                                    component={RichEditorField}
                                                    name="granttext"
                                                    height={100} />
                                            </Grid>
                                            <Grid item xs={12} style={{padding: 4}}>
                                                <Grid container spacing={8}>
                                                    <Grid item xs />
                                                    <Grid item xs="auto">
                                                        <Button color="secondary">
                                                            Clear
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs="auto">
                                                        <Button variant="contained" color="primary" onClick={this.handleGrantEditButtonSubmit}>
                                                            {this.state.grants.buttonAction}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </StandardCard>
                                </Grid>
                                <Grid item xs={12}>
                                    <MUIDataTable
                                        title="Grant list"
                                        data={grantData}
                                        columns={grantColumns}
                                        options={grantOptions}
                                    />
                                </Grid>
                            </React.Fragment>

                        }
                        {
                            ((this.state.tabbed && this.state.tabValue === 4) || !this.state.tabbed) &&
                            // Authors
                            <React.Fragment>
                                <Grid item xs={12}>
                                    <StandardCard title="Author detail" primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                        <Field
                                            component={ContributorsEditorField}
                                            showIdentifierLookup
                                            name="authoraffiliation"
                                            locale={{
                                                errorTitle: 'Error',
                                                errorMessage: 'Unable to add an item with the same identifier.',
                                                form: {
                                                    locale: {
                                                        nameAsPublishedLabel: 'Author name',
                                                        nameAsPublishedHint: '',
                                                        identifierLabel: 'UQ identifier (if available)',
                                                        descriptionStep1NoStep2: 'Enter each author and add affiliation data to each.',
                                                        addButton: <span>Add&nbsp;affiliation</span>
                                                    }
                                                }
                                            }}
                                        />
                                    </StandardCard>
                                </Grid>
                                <Grid item xs={12}>
                                    <StandardCard title="Author affiliation recommendations">
                                        <MUIDataTable
                                            data={authorRecData}
                                            columns={authorRecColumns}
                                            options={authorRecOptions}
                                        />
                                    </StandardCard>
                                </Grid>
                            </React.Fragment>
                        }
                        {
                            ((this.state.tabbed && this.state.tabValue === 5) || !this.state.tabbed) &&
                            // Files
                            <Grid item xs={12}>
                                <StandardCard title="Files" primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                    <Grid container spacing={16}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant="body2" component="p">Some explanatory text might go here. It may not. Time will tell.</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            name="files"
                                            component={ FileUploadField }
                                            requireOpenAccessStatus
                                            validate={[validation.validFileUpload]} />
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {
                            ((this.state.tabbed && this.state.tabValue === 6) || !this.state.tabbed) &&
                            // Security
                                <React.Fragment>
                                    <Grid item xs={12}>
                                        <StandardCard title="Security" primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} sm={12}>
                                                    <Field
                                                        component={SelectField}
                                                        name="level"
                                                        value={this.props.formValues.get('level')}
                                                        label="Use this interface as a..."
                                                        required
                                                        validation={[validation.required]}>
                                                        <MenuItem value="Superadmin" >Super admin</MenuItem>
                                                        <MenuItem value="Admin" >Admin</MenuItem>
                                                    </Field>
                                                    <br/><br/>
                                                    <Alert type="warning" title="Warning" message="This section is to be handled by admins only - changes made to these sections may inadvertantly hide or show records in error - please make sure you know what you`re doing." />
                                                </Grid>
                                            </Grid>
                                        </StandardCard>
                                    </Grid>
                                    {this.props.formValues.get('level') === 'Superadmin' &&
                                        <Grid item xs={12}>
                                            <StandardCard title={<span><b>Community</b> level security - UQ:12345</span>} accentHeader>
                                                <Grid container spacing={8}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" component="p">Lorem ipsum dolor sit
                                                            amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam
                                                            rhoncus congue consectetur. Aenean sed sapien
                                                            ipsum.</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Field
                                                            component={SelectField}
                                                            name="communitySecurity"
                                                            value={this.props.formValues.get('communitySecurity')}
                                                            label="Community policy to apply to this PID"
                                                            required
                                                            validation={[validation.required]}>
                                                            <MenuItem value="" disabled>Select a security policy to
                                                                apply</MenuItem>
                                                            {communitySecurity.map((item, index) => {
                                                                return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                            })}
                                                        </Field>
                                                    </Grid>
                                                    {
                                                        this.props.formValues.get('communitySecurity') &&
                                                        <Grid item xs={12} style={{
                                                            marginTop: 24,
                                                            padding: 24,
                                                            backgroundColor: 'rgba(0,0,0,0.05)'
                                                        }}>
                                                            <Typography variant="h6" style={{marginTop: -8}}>Selected
                                                                community record security policy details</Typography>
                                                            <Grid container spacing={8} style={{marginTop: 8}}>
                                                                <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                                <Grid item xs={10}>{communitySecurity[this.findWithAttr(communitySecurity, 'value', this.props.formValues.get('communitySecurity'))].name} ({communitySecurity[this.findWithAttr(communitySecurity, 'value', this.props.formValues.get('communitySecurity'))].id})</Grid>
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </StandardCard>
                                        </Grid>
                                    }
                                    {this.props.formValues.get('level') === 'Superadmin' &&
                                    <Grid item xs={12}>
                                        <StandardCard title={<span><b>Collection</b> level security - UQ:12345</span>} accentHeader>
                                            <Grid container spacing={8}>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2" component="p">Lorem ipsum dolor sit
                                                        amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam
                                                        rhoncus congue consectetur. Aenean sed sapien
                                                        ipsum.</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={SelectField}
                                                        name="collectionSecurity"
                                                        value={this.props.formValues.get('collectionSecurity')}
                                                        label="Collection policy to apply to this PID"
                                                        required
                                                        validation={[validation.required]}>
                                                        <MenuItem value="" disabled>Select a security policy to
                                                            apply</MenuItem>
                                                        {communitySecurity.map((item, index) => {
                                                            return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                        })}
                                                    </Field>
                                                </Grid>
                                                {
                                                    this.props.formValues.get('collectionSecurity') &&
                                                    <Grid item xs={12} style={{
                                                        marginTop: 24,
                                                        padding: 24,
                                                        backgroundColor: 'rgba(0,0,0,0.05)'
                                                    }}>
                                                        <Typography variant="h6" style={{marginTop: -8}}>Selected
                                                            collection record security policy details</Typography>
                                                        <Grid container spacing={8} style={{marginTop: 8}}>
                                                            <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                            <Grid item xs={10}>{communitySecurity[this.findWithAttr(communitySecurity, 'value', this.props.formValues.get('collectionSecurity'))].name} ({communitySecurity[this.findWithAttr(communitySecurity, 'value', this.props.formValues.get('collectionSecurity'))].id})</Grid>
                                                        </Grid>
                                                    </Grid>
                                                }
                                            </Grid>

                                            <Grid container spacing={8} style={{marginTop: 16}}>
                                                {false &&
                                                    <Grid item xs={12}>
                                                        <Field
                                                            component={SelectField}
                                                            name="collectionDataSecurity"
                                                            value={this.props.formValues.get('collectionDataSecurity')}
                                                            label={<span>Collection policy to apply to the <b>datastream</b> of this PID</span>}
                                                            required
                                                            validation={[validation.required]}>
                                                            <MenuItem value="" disabled>Select a security policy to
                                                                apply</MenuItem>
                                                            {communitySecurity.map((item, index) => {
                                                                return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                            })}
                                                        </Field>
                                                    </Grid>
                                                }
                                                {
                                                    this.props.formValues.get('collectionDataSecurity') &&
                                                    <Grid item xs={12} style={{
                                                        marginTop: 24,
                                                        padding: 24,
                                                        backgroundColor: 'rgba(0,0,0,0.05)'
                                                    }}>
                                                        <Typography variant="h6" style={{marginTop: -8}}>Selected collection <b>datastream</b> security policy details</Typography>
                                                        <Grid container spacing={8} style={{marginTop: 8}}>
                                                            <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                            <Grid item xs={10}>{communitySecurity[this.findWithAttr(communitySecurity, 'value', this.props.formValues.get('collectionDataSecurity'))].name} ({communitySecurity[this.findWithAttr(communitySecurity, 'value', this.props.formValues.get('collectionDataSecurity'))].id})</Grid>
                                                        </Grid>
                                                    </Grid>
                                                }
                                            </Grid>
                                        </StandardCard>
                                    </Grid>
                                    }
                                    {
                                        this.props.formValues.get('collectionDataSecurity') &&
                                        <Grid item xs={12}>
                                            <StandardCard title={
                                                <span><b>Datastream</b> security - UQ:12345</span>} accentHeader>
                                                <Grid container spacing={8}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" component="p">Lorem ipsum
                                                            dolor
                                                            sit amet, consectetur adipiscing elit. Ut id aliquam
                                                            sapien.
                                                            Aliquam rhoncus congue consectetur. Aenean sed sapien
                                                            ipsum.</Typography>
                                                    </Grid>
                                                    <Grid container spacing={8}>
                                                        <Grid item xs={12}>
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    checked={this.state.overrideSecurity2}
                                                                    onChange={this.toggleSecurityOverride2}
                                                                />}
                                                                label="Override inherited security (detailed below)."
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    {
                                                        this.props.formValues.get('collectionDataSecurity') && !this.state.overrideSecurity2 ?
                                                            <Grid item xs={12} style={{marginTop: 24, padding: 24, backgroundColor: 'rgba(0,0,0,0.05)'}}>
                                                                <Typography variant="h6" style={{marginTop: -8}}>Inherited security policy details</Typography>
                                                                <Grid container spacing={8} style={{marginTop: 8}}>
                                                                    <Grid item xs={2}><b>Collection:</b></Grid>
                                                                    <Grid item xs={5}>UQ:12345</Grid>
                                                                    <Grid item xs={5}>UQ:67890</Grid>
                                                                    <Grid item xs={2}><b>Policy:</b></Grid>
                                                                    <Grid item xs={5}>{communitySecurity[1].name} ({communitySecurity[1].id})</Grid>
                                                                    <Grid item xs={5}>{communitySecurity[2].name} ({communitySecurity[2].id})</Grid>
                                                                    <Grid item xs={2}><b>Description:</b></Grid>
                                                                    <Grid item xs={5}>{communitySecurity[1].description}</Grid>
                                                                    <Grid item xs={5}>{communitySecurity[2].description}</Grid>
                                                                </Grid>
                                                            </Grid>
                                                            :
                                                            <Grid item xs={12} style={{marginTop: 24, padding: 24, backgroundColor: 'rgba(0,0,0,0.05)'}}>
                                                                <Typography variant="h6" style={{marginTop: -8}}>Override datastream security policy details</Typography>
                                                                <Grid container spacing={8} alignContent="flex-end" alignItems="flex-end" style={{borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 8, paddingTop: 8}}>
                                                                    <Grid item xs={2}>Filename:</Grid>
                                                                    <Grid item xs={4}>Test_1.PDF</Grid>
                                                                    <Grid item xs={6}>
                                                                        <Field
                                                                            component={SelectField}
                                                                            name="filePolicy1"
                                                                            value={this.props.formValues.get('filePolicy1')}
                                                                            label={<span>Security policy for this file to override inheritance</span>}
                                                                            required
                                                                            validation={[validation.required]}>
                                                                            {communitySecurity.map((item, index) => {
                                                                                return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                                            })}
                                                                        </Field>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid container spacing={8} alignContent="flex-end" alignItems="flex-end" style={{borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 8, paddingTop: 8}}>
                                                                    <Grid item xs={2}>Filename:</Grid>
                                                                    <Grid item xs={4}>Test_3.JPG</Grid>
                                                                    <Grid item xs={6}>
                                                                        <Field
                                                                            component={SelectField}
                                                                            name="filePolicy2"
                                                                            value={this.props.formValues.get('filePolicy2')}
                                                                            label={<span>Security policy for this file to override inheritance</span>}
                                                                            required
                                                                            validation={[validation.required]}>
                                                                            {communitySecurity.map((item, index) => {
                                                                                return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                                            })}
                                                                        </Field>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                    }
                                                </Grid>
                                            </StandardCard>
                                        </Grid>
                                    }
                                    {this.props.formValues.get('level') &&
                                    <React.Fragment>
                                        <Grid item xs={12}>
                                            <StandardCard title={<span><b>Record</b> level security - UQ:12345</span>} accentHeader>
                                                {this.props.formValues.get('collectionSecurity') &&
                                                <Grid container spacing={8}>
                                                    <Grid item xs={12}>
                                                        <FormControlLabel
                                                            control={<Checkbox
                                                                checked={this.state.overrideSecurity}
                                                                onChange={this.toggleSecurityOverride}
                                                            />}
                                                            label="Override inherited security (detailed below)."
                                                        />
                                                    </Grid>
                                                </Grid>
                                                }
                                                {
                                                    !this.state.overrideSecurity && this.props.formValues.get('collectionSecurity') ?
                                                        <Grid item xs={12} style={{marginTop: 24, padding: 24, backgroundColor: 'rgba(0,0,0,0.05)'}}>
                                                            <Typography variant="h6" style={{marginTop: -8}}>Inherited security policy details</Typography>
                                                            <Grid container spacing={8} style={{marginTop: 8}}>
                                                                <Grid item xs={2}><b>Collection:</b></Grid>
                                                                <Grid item xs={5}>UQ:12345</Grid>
                                                                <Grid item xs={5}>UQ:67890</Grid>
                                                                <Grid item xs={2}><b>Policy:</b></Grid>
                                                                <Grid item xs={5}>{communitySecurity[1].name} ({communitySecurity[1].id})</Grid>
                                                                <Grid item xs={5}>{communitySecurity[2].name} ({communitySecurity[2].id})</Grid>
                                                            </Grid>
                                                        </Grid>
                                                        :
                                                        <React.Fragment>
                                                            <Grid item xs={12}>
                                                                <Field
                                                                    component={SelectField}
                                                                    name="overrideSecurity"
                                                                    value={this.props.formValues.get('overrideSecurity')}
                                                                    label="Policy to apply to override this PID`s inherited security"
                                                                    required
                                                                    validation={[validation.required]}>
                                                                    <MenuItem value="" disabled>Select a security
                                                                        policy
                                                                        to apply</MenuItem>
                                                                    {communitySecurity.map((item, index) => {
                                                                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                                    })}
                                                                </Field>
                                                            </Grid>
                                                            {
                                                                this.props.formValues.get('overrideSecurity') &&
                                                                <Grid item xs={12} style={{
                                                                    marginTop: 24,
                                                                    padding: 24,
                                                                    backgroundColor: 'rgba(0,0,0,0.05)'
                                                                }}>
                                                                    <Typography variant="h6" style={{marginTop: -8}}>Selected
                                                                        record level security policy
                                                                        details</Typography>
                                                                    <Grid container spacing={8} style={{marginTop: 8}}>
                                                                        <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                                        <Grid item xs={10}>{communitySecurity[this.findWithAttr(communitySecurity, 'value', this.props.formValues.get('overrideSecurity'))].name} ({communitySecurity[this.findWithAttr(communitySecurity, 'value', this.props.formValues.get('overrideSecurity'))].id})</Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            }
                                                        </React.Fragment>
                                                }
                                            </StandardCard>
                                        </Grid>
                                    </React.Fragment>
                                    }
                                </React.Fragment>
                        }
                    </Grid>
                </StandardPage>
            </form>
        );
    }
}

const AdminWithWidth = withWidth()(Admin);
export default withStyles(styles, {withTheme: true})(AdminWithWidth);
