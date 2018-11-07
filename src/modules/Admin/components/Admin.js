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
import {FileUploadField} from 'modules/SharedComponents/Toolbox/FileUploader';

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
        width: PropTypes.any,
        theme: PropTypes.object,
        submitting: PropTypes.any,
        disableSubmit: PropTypes.any,
        formValues: PropTypes.any
    };

    constructor(props) {
        super(props);
        this.state = {
            tabbed: Cookies.get('adminFormTabbed') ? !!(Cookies.get('adminFormTabbed') === 'tabbed') : true,
            tabValue: 4,
            grants: {
                showEdit: false,
                showAdd: false,
                buttonAction: 'Add new item'
            }
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

    handleGrantEditButtonSubmit = () => {
        this.setState({
            ...this.state,
            grants: {
                ...this.state.grants,
                buttonAction: 'Add new item'
            }
        });
    }

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

        const authorColumns = [
            {
                name: 'Author name',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: 'Author school/institute',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: 'Author affiliation',
                options: {
                    display: true,
                    sort: false,
                    filter: false
                }
            },
            {
                name: '',
                options: {
                    display: true,
                    sort: false,
                    filter: false
                }
            }];
        const authorData = [
            ['John Smith (uq12345)', 'UQ Diamantina Institute', <Field name={'author1affiliation'} component={GenericTextField} placeholder={'0%'}/>, <Button children={'Update'} />],
            ['Mary Jones (uq67890)', 'School of public health', <Field name={'author2affiliation'} component={GenericTextField} placeholder={'0%'}/>, <Button children={'Update'} />],
            ['Michael O`Reilly (uq98765)', 'Centre for health services research', <Field name={'author3affiliation'} component={GenericTextField} placeholder={'0%'}/>, <Button children={'Update'} />],
        ];
        const authorOptions = {
            filterType: 'checkbox',
            rowHover: false,
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
                name: 'Author school/institute',
                options: {
                    display: true,
                    sort: true,
                }
            },
            {
                name: 'Author affiliation',
                options: {
                    display: true,
                    sort: false,
                    filter: false
                }
            },
            {
                name: '',
                options: {
                    display: true,
                    sort: false,
                    filter: false
                }
            }];
        const authorRecData = [
            ['Peter Day (uq12345)', 'UQ Diamantina Institute', <Field name={'author1recaffiliation'} component={GenericTextField} placeholder={'0%'}/>, <Button children={'Add'} />],
            ['Mitchel Clarke (uq67890)', 'School of public health', <Field name={'author2recaffiliation'} component={GenericTextField} placeholder={'0%'}/>, <Button children={'Add'} />],
        ];
        const authorRecOptions = {
            filterType: 'checkbox',
            rowHover: false,
        };

        return (
            <form>
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
                                        <Tooltip title={`Switch to ${this.state.tabbed ? 'full form' : 'tabbed'} mode`}>
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
                                            fullWidth
                                            style={{marginRight: -56, marginLeft: -56}}
                                            classes={{indicator: classes.tabIndicator}}
                                            onChange={this.handleTabChange}
                                            scrollable
                                            scrollButtons={'on'}
                                            indicatorColor="primary"
                                            textColor="primary">
                                            <Tab label="Identifiers"/>
                                            <Tab label="Bibliographic"/>
                                            <Tab label="Admin"/>
                                            <Tab label="Grant Information"/>
                                            <Tab label="Author Affiliation"/>
                                            <Tab label="Files"/>
                                            {/* <Tab label="Security"/> */}
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
                            // Identifiers
                            <Grid item xs={12}>
                                <StandardCard title={'Identifiers'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <DownshiftMultiple
                                                initialValue={this.state.collection}
                                                sendData={this.handleMultiChipData}
                                                label={'Collection'}
                                                placeholder={'Begin typing to select and add collection(s)'}
                                                optionsList={collectionItems}
                                                name={'collection'} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="WOSisi"
                                                fullWidth
                                                label={'WOS ID (ISI Loc)'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="wosDocType"
                                                value={this.props.formValues.get('wosDocType')}
                                                label={'WOS Document type'}
                                                required
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Select a document type</MenuItem>
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
                                                label={'Scopus ID'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="scopusDocType"
                                                value={this.props.formValues.get('scopusDocType')}
                                                label={'Scopus Document type'}
                                                required
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Select a document type</MenuItem>
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
                                                label={'PubMed ID'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="pubmedDocType"
                                                value={this.props.formValues.get('pubmedDocType')}
                                                label={'PubMed Document type'}
                                                required
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Select a document type</MenuItem>
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
                                <StandardCard title={'Bibliographic'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12}>
                                            <Typography variant={'caption'} component={'span'} style={{opacity: 0.66}}>Formatted title</Typography>
                                            <Field
                                                component={RichEditorField}
                                                name="title"
                                                height={100}
                                                validate={[validation.required]}/>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="authorName"
                                                fullWidth
                                                label={'Author name'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="authorId"
                                                fullWidth
                                                label={'Author ID'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="authorAffiliationId"
                                                fullWidth
                                                label={'Author affiliation ID'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="authorAffiliationCountry"
                                                fullWidth
                                                label={'Author affiliation country'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="authorAffiliationName"
                                                fullWidth
                                                label={'Author affiliation name'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Field
                                                component={GenericTextField}
                                                name="authorAffiliationAddress"
                                                fullWidth
                                                label={'Author affiliation full address'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="language"
                                                value={this.props.formValues.get('language')}
                                                label={'Language'}
                                                required
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Please select a language</MenuItem>
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
                                                label={'Native title'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="romanScriptTitle"
                                                fullWidth
                                                label={'Roman script title'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="translatedTitle"
                                                fullWidth
                                                label={'Translated title'}
                                                placeholder={''} />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="journalName"
                                                fullWidth
                                                label={'Journal name'}
                                                placeholder={''}  />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="ISSN"
                                                fullWidth
                                                label={'ISSN'}
                                                placeholder={''} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="ISBN"
                                                fullWidth
                                                label={'ISBN'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="pubplace"
                                                fullWidth
                                                label={'Place of publication'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="publisher"
                                                fullWidth
                                                label={'Publisher'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="eraJournal"
                                                fullWidth
                                                label={'ERA journal'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={GenericTextField}
                                                name="eraJournalId"
                                                fullWidth
                                                label={'ERA journal ID'}
                                                placeholder={''}
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
                                                label={'Publication date'}

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                component={SelectField}
                                                disabled={this.props.submitting}
                                                name="subtype"
                                                value={this.props.formValues.get('subtype')}
                                                label={'eSpace subtype'}
                                                required
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Select a document subtype</MenuItem>
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
                                                label={'DOI'}
                                                placeholder={''}
                                                required
                                                validate={[validation.required]} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="doiembargodays"
                                                fullWidth
                                                label={'DOI Embargo days'}
                                                placeholder={''} />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="volume"
                                                fullWidth
                                                label={'Volume'}
                                                placeholder={''} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="issue"
                                                fullWidth
                                                label={'Issue'}
                                                placeholder={''} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="articlenumber"
                                                fullWidth
                                                label={'Article number'}
                                                placeholder={''} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="startpage"
                                                fullWidth
                                                label={'Start page'}
                                                placeholder={''} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="endpage"
                                                fullWidth
                                                label={'End page'}
                                                placeholder={''} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={GenericTextField}
                                                name="totalpages"
                                                fullWidth
                                                label={'Total pages'}
                                                placeholder={''} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <DownshiftMultiple
                                                initialValue={this.state.subject}
                                                sendData={this.handleMultiChipData}
                                                label={'Subject(s)'}
                                                placeholder={'Begin typing to select and add subject(s)'}
                                                optionsList={subjects}
                                                name={'subject'} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Field
                                                component={ListEditorField}
                                                name="keywords"
                                                remindToAdd
                                                maxCount={10}
                                                searchKey={{value: 'keyword', order: 'order'}}
                                                value={'hello'}
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
                                            <Typography variant={'caption'} component={'span'} style={{opacity: 0.66}}>Formatted abstract</Typography>
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
                                <StandardCard title={'Admin'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={SelectField}
                                                name="refsource"
                                                value={this.props.formValues.get('refsource')}
                                                label={'Refereed Source'}
                                                required
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Please select a source</MenuItem>
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
                                                label={'Open access status'}
                                                required
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Please select a status</MenuItem>
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
                                                label={'Succeeds'}
                                                placeholder={'PID of succeeded record'} />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={SelectField}
                                                name="qindexcode"
                                                value={this.props.formValues.get('qindexcode')}
                                                label={'Research Code (Q-Index code)'}
                                                required
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Please select a code</MenuItem>
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
                                                label={'Research Code status'}
                                                required
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Please select a status</MenuItem>
                                                <MenuItem value={1} >Confirmed code</MenuItem>
                                                <MenuItem value={2} >Provisional code</MenuItem>
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Field
                                                component={SelectField}
                                                name="inststatus"
                                                value={this.props.formValues.get('inststatus')}
                                                label={'Institutional status'}
                                                placeholder={''}>
                                                <MenuItem value={''} disabled>Please select a status</MenuItem>
                                                <MenuItem value={1} >UQ</MenuItem>
                                                <MenuItem value={2} >Non-UQ</MenuItem>
                                                <MenuItem value={3} >Unknown</MenuItem>
                                            </Field>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant={'caption'} component={'span'} style={{opacity: 0.66}}>Additional notes</Typography>
                                            <Field
                                                component={RichEditorField}
                                                name="notes"
                                                height={100}
                                                validate={[validation.required]}/>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant={'caption'} component={'span'} style={{opacity: 0.66}}>Internal notes</Typography>
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
                                    <StandardCard title={'Grant information'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                        <Grid container spacing={8} style={{marginTop: -24}}>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    component={GenericTextField}
                                                    name="grantagency"
                                                    fullWidth
                                                    label={'Grant agency'}
                                                    placeholder={''} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    component={GenericTextField}
                                                    name="grantagencyid"
                                                    fullWidth
                                                    label={'Grant agency ID'}
                                                    placeholder={''} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    component={GenericTextField}
                                                    name="grantid"
                                                    fullWidth
                                                    label={'Grant ID'}
                                                    placeholder={''} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    component={GenericTextField}
                                                    name="grantacronym"
                                                    fullWidth
                                                    label={'Grant acronym'}
                                                    placeholder={''} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant={'caption'} component={'span'} style={{opacity: 0.66}}>Grant text</Typography>
                                                <Field
                                                    component={RichEditorField}
                                                    name="granttext"
                                                    height={100} />
                                            </Grid>
                                            <Grid item xs={12} style={{padding: 4}}>
                                                <Grid container spacing={8}>
                                                    <Grid item xs />
                                                    <Grid item xs={'auto'}>
                                                        <Button color={'secondary'}>
                                                            Clear
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={'auto'}>
                                                        <Button variant={'contained'} color={'primary'} onClick={this.handleGrantEditButtonSubmit}>
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
                                        title={'Grant list'}
                                        data={grantData}
                                        columns={grantColumns}
                                        options={grantOptions}
                                    />
                                </Grid>
                            </React.Fragment>

                        }
                        {
                            ((this.state.tabbed && this.state.tabValue === 4) || !this.state.tabbed) &&
                            // Author Affiliation
                            <React.Fragment>
                                <Grid item xs={12}>
                                    <StandardCard title={'Author Affiliation'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                        <Typography variant={'h6'}>Add a new affiliation</Typography>
                                    </StandardCard>
                                </Grid>
                                <Grid item xs={12}>
                                    <MUIDataTable
                                        title={'Recommended affiliations'}
                                        data={authorRecData}
                                        columns={authorRecColumns}
                                        options={authorRecOptions}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <MUIDataTable
                                        title={'Currently recorded author affiliations'}
                                        data={authorData}
                                        columns={authorColumns}
                                        options={authorOptions}
                                    />
                                </Grid>
                            </React.Fragment>
                        }
                        {
                            ((this.state.tabbed && this.state.tabValue === 5) || !this.state.tabbed) &&
                            // Files
                            <Grid item xs={12}>
                                <StandardCard title={'Files'} primaryHeader={!!this.state.tabbed} squareTop={!!this.state.tabbed}>
                                    <Grid container spacing={16}>
                                        <Grid item xs={12} sm={12}>
                                            <Typography variant={'body2'} component={'p'}>Some explanatory text might go here. It may not. Time will tell.</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            name="files"
                                            component={ FileUploadField }
                                            requireOpenAccessStatus
                                            validate={[validation.validFileUpload]} />
                                    </Grid>
                                    <Grid item xs={12} style={{padding: '8px 0'}}>
                                        <Grid container spacing={16}>
                                            <Grid item xs/>
                                            <Grid item xs={'auto'}>
                                                <Button color={'secondary'}>
                                                    Clear list
                                                </Button>
                                            </Grid>
                                            <Grid item xs={'auto'}>
                                                <Button variant={'contained'} color={'primary'}>
                                                    Upload files
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                    </Grid>
                </StandardPage>
            </form>
        );
    }
}

const AdminWithWidth = withWidth()(Admin);
export default withStyles(styles, {withTheme: true})(AdminWithWidth);
