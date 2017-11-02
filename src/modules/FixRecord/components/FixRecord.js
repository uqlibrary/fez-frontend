import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';

import {SelectField, TextField, StandardPage, StandardCard, Alert, ConfirmDialogBox, FileUploadField, InlineLoader} from 'uqlibrary-react-toolbox';
import {PublicationCitation} from 'modules/SharedComponents/PublicationsList';
import {validation, locale, routes} from 'config';
import {Prompt} from 'react-router-dom';

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
        const isAuthorLinked = author && recordToFix && recordToFix.fez_record_search_key_author_id && recordToFix.fez_record_search_key_author_id.length > 0 &&
            recordToFix.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === author.aut_id).length > 0;

        if (!(this.props.authorLoading || this.props.recordToFixLoading) && !isAuthorLinked) {
            // if either author or publication data is missing, abandon form
            this.props.history.go(-1);
        }
    }

    componentDidMount() {
        if (!this.props.recordToFixLoading && !this.props.recordToFix) {
            this.props.actions.loadRecordToFix(this.props.match.params.pid);
        }
        if (!this.props.authorLoading && !this.props.author) {
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
        this.props.actions.clearFixRecord();
    }

    _navigateToMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    }

    _navigateToDashboard = () => {
        this.props.history.push(routes.pathConfig.dashboard);
    };

    _showConfirmation = () => {
        if (this.props.pristine || !this.cancelConfirmationBox) {
            this._navigateToMyResearch();
        } else {
            this.cancelConfirmationBox.showConfirmation();
            this.setConfirmationOpened();
        }
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

    setConfirmationOpened = () => {
        this.setState({
            confirmationOpened: true
        });
    };

    _setConfirmationClosed = () => {
        this.setState({
            confirmationOpened: false
        });
    };

    _handleSubmit = () => {
        this.setConfirmationOpened();
        this.props.handleSubmit();
    };

    getAlert = ({submitFailed = false, error, dirty = false, invalid = false, submitting = false,
        submitSucceeded = false, alertLocale = {}}) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {...alertLocale.errorAlert};
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

    _setCancelConfirmation = (ref) => {
        this.cancelConfirmationBox = ref;
    };

    render() {
        const txt = locale.pages.fixRecord;

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

        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <Prompt when={this.props.dirty && !this.state.confirmationOpened} message={locale.global.discardFormChangesConfirmation.confirmationMessage}/>

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
                            <ConfirmDialogBox
                                onRef={this._setCancelConfirmation}
                                onAction={this._navigateToMyResearch}
                                onCancelAction={this._setConfirmationClosed}
                                locale={txt.fix.cancelWorkflowConfirmation}/>
                            <ConfirmDialogBox
                                onRef={this._setSuccessConfirmation}
                                onAction={this._navigateToMyResearch}
                                onCancelAction={this._navigateToDashboard}
                                locale={txt.fix.successWorkflowConfirmation}/>
                            <StandardCard title={txt.fix.comments.title} help={txt.fix.comments.help}>
                                <Field
                                    component={TextField}
                                    className="requiredField"
                                    disabled={this.props.submitting}
                                    name="comments"
                                    type="text"
                                    fullWidth
                                    multiLine
                                    rows={1}
                                    floatingLabelText={txt.fix.comments.fieldLabels.comments}
                                    validate={[validation.required]}/>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="rek_link"
                                    type="text"
                                    fullWidth
                                    floatingLabelText={txt.fix.comments.fieldLabels.url}
                                    validate={[validation.url]}/>
                            </StandardCard>
                            <StandardCard title={txt.fix.fileUpload.title} help={txt.fix.fileUpload.help}>
                                {txt.fix.fileUpload.description}
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
                        <StandardCard title={txt.unclaim.title} help={txt.unclaim.help}>
                            <Alert {...txt.unclaim.alert}/>
                            {txt.unclaim.description}
                            <ConfirmDialogBox
                                onRef={this._setSuccessConfirmation}
                                onAction={this._navigateToMyResearch}
                                onCancelAction={this._navigateToDashboard}
                                locale={txt.unclaim.successWorkflowConfirmation}/>
                        </StandardCard>
                    }

                    {
                        this.getAlert({...this.props, alertLocale: txt.fix})
                    }

                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                label={txt.cancel}
                                disabled={this.props.submitting}
                                onTouchTap={this._showConfirmation}/>
                        </div>
                        {
                            this.state.selectedRecordAction &&
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    secondary
                                    fullWidth
                                    label={txt.submit}
                                    onTouchTap={this._handleSubmit}
                                    disabled={this.props.submitting || this.props.invalid}/>
                            </div>
                        }
                    </div>
                </form>
            </StandardPage>
        );
    }
}
