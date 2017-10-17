import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {TextField, StandardPage, StandardCard, Alert, ConfirmDialogBox, FileUploadField} from 'uqlibrary-react-toolbox';
import {PublicationCitation} from 'modules/SharedComponents/PublicationsList';
import {validation, locale, routes} from 'config';

export default class FixRecord extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        recordToFix: PropTypes.object,
        recordToFixLoading: PropTypes.bool,
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

    componentDidMount() {
        if (!this.props.recordToFixLoading && !this.props.initialValues.get('publication')) {
            this.props.actions.loadRecordToFix(this.props.match.params.pid);
        }
        // if (!this.props.authorLoading && !this.props.initialValues.get('author')) {
        //     this.props.actions.loadCurrentAccount();
        // }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        // clear previously selected publication for a fix
        this.props.actions.clearFixRecord();
    }

    _navigateToPreviousPage = () => {
        this.props.history.go(-1);
    }

    _navigateToDashboard = () => {
        this.props.history.push(routes.pathConfig.dashboard);
    };

    _showConfirmation = () => {
        if (this.props.pristine || !this.cancelConfirmationBox) {
            this._navigateToPreviousPage();
        } else {
            this.cancelConfirmationBox.showConfirmation();
        }
    };

    _actionSelected = (event, index, value) => {
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

    render() {
        const txt = locale.pages.fixRecord;
        const publication = this.props.initialValues.get('publication') ? this.props.initialValues.get('publication').toJS() : null;
        const author = this.props.initialValues.get('author') ? this.props.initialValues.get('author').toJS() : null;
        const isAuthorLinked = author && publication && publication.fez_record_search_key_author_id && publication.fez_record_search_key_author_id.length > 0 &&
            publication.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === author.aut_id).length > 0;

        console.log('render');
        console.log(this.props);

        if (!this.props.authorLoading && !isAuthorLinked) {
            // if either author or publication data is missing, abandon form
            this.props.history.go(-1);
            return <div/>;
        }

        return (
            <StandardPage title={txt.title}>
                {
                    this.props.authorLoading &&
                    <div> Loading details...</div>
                }

                {
                    publication &&
                    <form onKeyDown={this._handleKeyboardFormSubmit}>
                        <StandardCard title={txt.subTitle} help={txt.help}>
                            <PublicationCitation publication={publication}/>
                            <SelectField
                                id="fixAction"
                                fullWidth
                                {...this.context.selectFieldMobileOverrides}
                                value={this.state.selectedRecordAction}
                                maxHeight={250}
                                onChange={this._actionSelected}
                                floatingLabelText={txt.fieldLabels.action}>
                                {txt.actionsOptions.map((item, index) => (
                                    <MenuItem
                                        value={item.action} primaryText={item.title}
                                        key={`fix_record_action_${index}`}/>
                                ))}
                            </SelectField>
                        </StandardCard>
                        {
                            this.state.selectedRecordAction === 'fix' &&
                            <div>
                                <ConfirmDialogBox
                                    onRef={ref => (this.cancelConfirmationBox = ref)}
                                    onAction={this._navigateToPreviousPage}
                                    locale={txt.fix.cancelWorkflowConfirmation}/>
                                <ConfirmDialogBox
                                    onRef={ref => (this.successConfirmationBox = ref)}
                                    onAction={this._navigateToDashboard}
                                    onCancelAction={this._navigateToPreviousPage}
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
                                        validate={[validation.url, validation.maxLength255]}/>
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
                                    onRef={ref => (this.successConfirmationBox = ref)}
                                    onAction={this._navigateToPreviousPage}
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
                                        onTouchTap={this.props.handleSubmit}
                                        disabled={this.props.submitting || this.props.invalid}/>
                                </div>
                            }
                        </div>
                    </form>
                }
            </StandardPage>
        );
    }
}
