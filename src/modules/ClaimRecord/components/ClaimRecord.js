import React from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';

import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {TextField} from 'uqlibrary-react-toolbox/build/TextField';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox/build/ConfirmDialogBox';
import {FileUploadField} from 'uqlibrary-react-toolbox/build/FileUploader';
import {NavigationDialogBox} from 'uqlibrary-react-toolbox/build/NavigationPrompt';


import {PublicationCitation} from 'modules/SharedComponents/PublicationsList';
import {AuthorLinkingField, ContributorLinkingField} from 'modules/SharedComponents/AuthorLinking';
import {validation, routes} from 'config';
import {locale} from 'locale';

export default class ClaimRecord extends React.PureComponent {
    static propTypes = {
        ...propTypes, // all redux-form props
        publicationToClaimFileUploadingError: PropTypes.bool,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const publication = this.props.initialValues.get('publication') ? this.props.initialValues.get('publication').toJS() : null;
        const author = this.props.initialValues.get('author') ? this.props.initialValues.get('author').toJS() : null;

        if (!author || !publication) {
            this.props.history.go(-1);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox.showConfirmation();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    }

    componentWillUnmount() {
        // clear previously selected publication for a claim
        this.props.actions.clearClaimPublication();
    }

    _navigateToMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    }

    _navigateToAddRecord = () => {
        this.props.history.push(routes.pathConfig.records.add.find);
    }

    _navigateToPossibleMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.possible);
    }

    _handleKeyboardFormSubmit = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.props.handleSubmit();
        }
    };

    getAlert = ({submitFailed = false, invalid = false, errors = {}, submitting = false, submitSucceeded = false, alertLocale, authorLinked = false}) => {
        let alertProps = null;
        if (submitFailed) {
            alertProps = {...alertLocale.errorAlert, message: alertLocale.errorAlert.message ? alertLocale.errorAlert.message(errors) : errors};
        } else if (submitting) {
            alertProps = {...alertLocale.progressAlert};
        } else if (submitSucceeded) {
            alertProps = {...alertLocale.successAlert};
        } else if (authorLinked) {
            alertProps = {...alertLocale.alreadyClaimedAlert};
        } else if (invalid && errors) {
            const formErrorLabels = {
                authorLinking: alertLocale.authorLinking && alertLocale.authorLinking.title,
                contributorLinking: alertLocale.contributorLinking && alertLocale.contributorLinking.title,
                rek_link: alertLocale.comments && alertLocale.comments.fieldLabels.url,
                files: 'File upload'
            };
            const validationMessage = (
                <span className="validationMessage">
                    {alertLocale.validationAlert.message}
                    <ul className="validationList">
                        {Object.keys(errors).map((key, index) => (
                            <li className="validationItem" key={`validation-${index}`}><b>{formErrorLabels[key]}</b> - {errors[key]}</li>
                        ))}
                    </ul>
                </span>
            );
            alertProps = {...alertLocale.validationAlert, message: validationMessage};
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    _setSuccessConfirmation = (ref) => {
        this.successConfirmationBox = ref;
    };

    render() {
        const txt = locale.forms.claimPublicationForm;
        const publication = this.props.initialValues.get('publication') ? this.props.initialValues.get('publication').toJS() : null;
        const author = this.props.initialValues.get('author') ? this.props.initialValues.get('author').toJS() : null;
        if (!author || !publication) {
            return (<div />);
        }
        const authorLinked = publication && author && publication.fez_record_search_key_author_id && publication.fez_record_search_key_author_id.length > 0 &&
            publication.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === author.aut_id).length > 0;
        const contributorLinked = publication && author && publication.fez_record_search_key_contributor_id && publication.fez_record_search_key_contributor_id.length > 0 &&
            publication.fez_record_search_key_contributor_id.filter(contributorId => contributorId.rek_contributor_id === author.aut_id).length > 0;

        // if publication.sources is set, user is claiming from Add missing record page
        const fromAddRecord = !!publication.sources;
        // set confirmation message depending on file upload status and publication fromAddRecord
        const saveConfirmationLocale = {...txt.successWorkflowConfirmation};

        saveConfirmationLocale.cancelButtonLabel = fromAddRecord
            ? txt.successWorkflowConfirmation.addRecordButtonLabel : txt.successWorkflowConfirmation.cancelButtonLabel;

        saveConfirmationLocale.confirmationMessage = (
            <div>
                {this.props.publicationToClaimFileUploadingError && <Alert {...txt.successWorkflowConfirmation.fileFailConfirmationAlert} />}
                {txt.successWorkflowConfirmation.successConfirmationMessage}
            </div>
        );
        console.log('errors: ' + JSON.stringify(this.props.errors));
        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <StandardCard title={txt.claimingInformation.title} help={txt.claimingInformation.help}>
                        <PublicationCitation publication={publication}/>
                    </StandardCard>
                    {
                        (!publication.rek_pid || !(authorLinked || contributorLinked)) &&
                        <div>
                            <ConfirmDialogBox
                                onRef={this._setSuccessConfirmation}
                                onAction={this._navigateToMyResearch}
                                onCancelAction={fromAddRecord ? this._navigateToAddRecord : this._navigateToPossibleMyResearch}
                                locale={saveConfirmationLocale} />
                            <NavigationDialogBox when={this.props.dirty && !this.props.submitSucceeded} txt={txt.cancelWorkflowConfirmation} />
                            {
                                publication.fez_record_search_key_author &&
                                publication.fez_record_search_key_author.length > 1
                                && !authorLinked &&
                                <StandardCard
                                    title={txt.authorLinking.title}
                                    help={txt.authorLinking.help}
                                    className="requiredField">
                                    <label htmlFor="authorLinking">{txt.authorLinking.text}</label>
                                    <Field
                                        name="authorLinking"
                                        component={AuthorLinkingField}
                                        loggedInAuthor={author}
                                        authorList={publication.fez_record_search_key_author}
                                        linkedAuthorIdList={publication.fez_record_search_key_author_id}
                                        disabled={this.props.submitting}
                                        className="requiredField"
                                        validate={[validation.required, validation.isValidAuthorLink]}
                                    />
                                </StandardCard>
                            }
                            {/* Show contributor linking only for records that don't have authors, eg Edited Books */}
                            {
                                publication.fez_record_search_key_author &&
                                publication.fez_record_search_key_author.length === 0 &&
                                publication.fez_record_search_key_contributor &&
                                publication.fez_record_search_key_contributor.length > 1 &&
                                !contributorLinked &&
                                <StandardCard
                                    title={txt.contributorLinking.title}
                                    help={txt.contributorLinking.help}
                                    className="requiredField">
                                    <label htmlFor="contributorLinking">{txt.contributorLinking.text}</label>
                                    <Field
                                        name="contributorLinking"
                                        component={ContributorLinkingField}
                                        loggedInAuthor={author}
                                        authorList={publication.fez_record_search_key_contributor}
                                        linkedAuthorIdList={publication.fez_record_search_key_contributor_id}
                                        disabled={this.props.submitting}
                                        className="requiredField"
                                        validate={[validation.required, validation.isValidContributorLink]}
                                    />
                                </StandardCard>
                            }
                            <StandardCard title={txt.comments.title} help={txt.comments.help}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="comments"
                                    type="text"
                                    fullWidth
                                    multiLine
                                    rows={1}
                                    floatingLabelText={txt.comments.fieldLabels.comments}/>

                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="rek_link"
                                    type="text"
                                    fullWidth
                                    floatingLabelText={txt.comments.fieldLabels.url}
                                    validate={[validation.url]}/>
                            </StandardCard>

                            <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                                <Field
                                    name="files"
                                    component={ FileUploadField }
                                    disabled={this.props.submitting}
                                    requireOpenAccessStatus
                                    validate={[validation.validFileUpload]}
                                />
                            </StandardCard>
                        </div>
                    }

                    {
                        this.getAlert({...this.props, alertLocale: txt, authorLinked: publication.rek_pid && (authorLinked || contributorLinked)})
                    }

                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                label={txt.cancel}
                                disabled={this.props.submitting}
                                onTouchTap={fromAddRecord ? this._navigateToAddRecord : this._navigateToPossibleMyResearch}/>
                        </div>
                        {
                            (!publication.rek_pid || !(authorLinked || contributorLinked)) &&
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    secondary
                                    fullWidth
                                    label={txt.submit}
                                    onTouchTap={this.props.handleSubmit}
                                    disabled={this.props.submitting || this.props.invalid}
                                />
                            </div>
                        }
                    </div>
                </form>
            </StandardPage>
        );
    }
}
