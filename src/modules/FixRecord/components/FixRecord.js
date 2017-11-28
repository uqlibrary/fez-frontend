import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';

import {SelectField} from 'uqlibrary-react-toolbox/build/SelectField';
import {TextField} from 'uqlibrary-react-toolbox/build/TextField';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox/build/ConfirmDialogBox';
import {NavigationDialogBox} from 'uqlibrary-react-toolbox/build/NavigationPrompt';
import {FileUploadField} from 'uqlibrary-react-toolbox/build/FileUploader';
import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';

import {PublicationCitation} from 'modules/SharedComponents/PublicationsList';
import {validation, locale, routes} from 'config';

export default class FixRecord extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props

        recordToFix: PropTypes.object,
        recordToFixLoading: PropTypes.bool,

        author: PropTypes.object,
        authorLoading: PropTypes.bool,

        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedRecordAction: ''
        };
    }

    componentWillMount() {
        const {recordToFix, author} = this.props;

        const isAuthorLinked = author && recordToFix && this.isLoggedInUserLinked(author, recordToFix, 'fez_record_search_key_author_id', 'rek_author_id');
        const isContributorLinked = author && recordToFix && this.isLoggedInUserLinked(author, recordToFix, 'fez_record_search_key_contributor_id', 'rek_contributor_id');

        if (!(this.props.authorLoading || this.props.recordToFixLoading) && !isAuthorLinked && !isContributorLinked) {
            // if either author or publication data is missing, abandon form
            this.props.history.go(-1);
        }
    }

    componentDidMount() {
        if (this.props.actions && !this.props.recordToFixLoading && !this.props.recordToFix) {
            this.props.actions.loadRecordToFix(this.props.match.params.pid);
        }
        if (this.props.actions && !this.props.authorLoading && !this.props.author) {
            this.props.actions.loadCurrentAccount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        // clear previously selected recordToFix for a fix
        if (this.props.actions) this.props.actions.clearFixRecord();
    }

    isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
        return recordToFix[searchKey] && recordToFix[searchKey].length > 0 && recordToFix[searchKey].filter(authorId => authorId[subkey] === author.aut_id).length > 0;
    };

    _navigateToMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    }

    _navigateToDashboard = () => {
        this.props.history.push(routes.pathConfig.dashboard);
    };

    _actionSelected = (event, value) => {
        this.setState({
            selectedRecordAction: value
        });
    };

    _handleKeyboardFormSubmit = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.props.handleSubmit();
        }
    };

    getAlert = ({submitFailed = false, dirty = false, invalid = false, submitting = false, error,
        submitSucceeded = false, alertLocale = {}}) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {...alertLocale.errorAlert, message: alertLocale.errorAlert.message ? alertLocale.errorAlert.message(error) : error};
        } else if (!submitFailed && dirty && invalid) {
            alertProps = {...alertLocale.validationAlert};
        } else if (submitting) {
            alertProps = {...alertLocale.progressAlert};
        } else if (submitSucceeded) {
            alertProps = {...alertLocale.successAlert};
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    _setSuccessConfirmation = (ref) => {
        this.successConfirmationBox = ref;
    };

    render() {
        const txt = locale.pages.fixRecord;
        const txtFixForm = locale.forms.fixPublicationForm;
        const txtUnclaimForm = locale.forms.unclaimPublicationForm;

        if(this.props.authorLoading || this.props.recordToFixLoading) {
            return (
                <div className="is-centered">
                    <InlineLoader message={txt.loadingMessage}/>
                </div>
            );
        }

        const {recordToFix, author} = this.props;
        if (!recordToFix || !author) return (<div />);

        const fixOptions = txt.actionsOptions.map((item, index) => (
            <MenuItem
                value={item.action}
                primaryText={item.title}
                key={`fix_record_action_${index}`} />
        ));

        // set confirmation message depending on file upload status
        const saveConfirmationLocale = {...txtFixForm.successWorkflowConfirmation};
        if (this.props.publicationToFixFileUploadingError) {
            saveConfirmationLocale.confirmationMessage = saveConfirmationLocale.fileFailConfirmationMessage;
        }

        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <StandardCard title={txt.subTitle} help={txt.help}>
                        <PublicationCitation publication={recordToFix}/>

                        <Field
                            component={SelectField}
                            disabled={this.props.submitting}
                            name="fixAction"
                            {...this.context.selectFieldMobileOverrides}
                            floatingLabelText={txt.fieldLabels.action}
                            validate={[validation.required]}
                            onChange={this._actionSelected}
                            className="requiredField">
                            {fixOptions}
                        </Field>
                    </StandardCard>
                    {
                        this.state.selectedRecordAction === 'fix' &&
                        <div>
                            <NavigationDialogBox when={this.props.dirty && !this.props.submitSucceeded} txt={txtFixForm.cancelWorkflowConfirmation} />
                            <ConfirmDialogBox
                                onRef={this._setSuccessConfirmation}
                                onAction={this._navigateToMyResearch}
                                onCancelAction={this._navigateToDashboard}
                                locale={saveConfirmationLocale}/>
                            <StandardCard title={txtFixForm.comments.title} help={txtFixForm.comments.help}>
                                <Field
                                    component={TextField}
                                    className="requiredField"
                                    disabled={this.props.submitting}
                                    name="comments"
                                    type="text"
                                    fullWidth
                                    multiLine
                                    rows={1}
                                    floatingLabelText={txtFixForm.comments.fieldLabels.comments}
                                    validate={[validation.required]}/>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="rek_link"
                                    type="text"
                                    fullWidth
                                    floatingLabelText={txtFixForm.comments.fieldLabels.url}
                                    validate={[validation.url]}/>
                            </StandardCard>
                            <StandardCard title={txtFixForm.fileUpload.title} help={txtFixForm.fileUpload.help}>
                                {txtFixForm.fileUpload.description}
                                <Field
                                    name="files"
                                    component={FileUploadField}
                                    disabled={this.props.submitting}
                                    requireFileAccess
                                    validate={[validation.validFileUpload]}
                                />
                            </StandardCard>
                        </div>
                    }

                    {
                        this.state.selectedRecordAction === 'unclaim' &&
                        <StandardCard title={txtUnclaimForm.title} help={txtUnclaimForm.help}>
                            <Alert {...txtUnclaimForm.alert}/>
                            {txtUnclaimForm.description}
                            <ConfirmDialogBox
                                onRef={this._setSuccessConfirmation}
                                onAction={this._navigateToMyResearch}
                                onCancelAction={this._navigateToDashboard}
                                locale={txtUnclaimForm.successWorkflowConfirmation}/>
                        </StandardCard>
                    }

                    {
                        this.getAlert({...this.props, alertLocale: txtFixForm})
                    }

                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                label={txt.cancel}
                                disabled={this.props.submitting}
                                onTouchTap={this._navigateToMyResearch}/>
                        </div>
                        {
                            this.state.selectedRecordAction &&
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    secondary
                                    fullWidth
                                    label={txt.submit}
                                    onTouchTap={this.props.handleSubmit}
                                    disabled={this.props.submitting || this.props.invalid}/>
                            </div>
                        }
                    </div>
                </form>
            </StandardPage>
        );
    }
}
