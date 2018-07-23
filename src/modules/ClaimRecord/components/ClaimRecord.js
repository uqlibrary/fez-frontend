import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import {FileUploadField} from 'modules/SharedComponents/Toolbox/FileUploader';
import {NavigationDialogBox} from 'modules/SharedComponents/Toolbox/NavigationPrompt';

import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {AuthorLinkingField, ContributorLinkingField} from 'modules/SharedComponents/AuthorLinking';
import {validation, routes} from 'config';
import locale from 'locale/forms';

export default class ClaimRecord extends PureComponent {
    static propTypes = {
        ...propTypes, // all redux-form props
        disableSubmit: PropTypes.bool,
        publicationToClaimFileUploadingError: PropTypes.bool,
        publicationFailedToClaim: PropTypes.string,
        redirectPath: PropTypes.string,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

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

    componentWillUnmount() {
        // clear previously selected publication for a claim
        this.props.actions.clearClaimPublication();
    }

    _navigateToMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    };

    _cancelClaim = () => {
        this.props.history.goBack();
    };

    _claimAnother = () => {
        if (!!this.props.redirectPath) {
            this.props.history.push(this.props.redirectPath);
            this.props.actions.clearRedirectPath();
        } else {
            this.props.history.goBack();
        }
    };

    _setSuccessConfirmation = (ref) => {
        this.successConfirmationBox = ref;
    };

    _handleDefaultSubmit = (event) => {
        if(event) event.preventDefault();
    };

    _contributorValidation = (link) => {
        const publication = this.props.initialValues.get('publication').toJS();
        return publication.fez_record_search_key_author_id && publication.fez_record_search_key_author_id.length > 0 ?
            validation.isValidContributorLink(link) : validation.isValidContributorLink(link, true);
    }

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
        const contributorClassName = publication.fez_record_search_key_author && publication.fez_record_search_key_author.length > 0 ? 'contributorsField' : 'requiredField';

        // if publication.sources is set, user is claiming from Add missing record page
        const fromAddRecord = !!publication.sources;
        // set confirmation message depending on file upload status and publication fromAddRecord
        const saveConfirmationLocale = {...txt.successWorkflowConfirmation};

        saveConfirmationLocale.cancelButtonLabel = fromAddRecord
            ? txt.successWorkflowConfirmation.addRecordButtonLabel
            : txt.successWorkflowConfirmation.cancelButtonLabel;

        saveConfirmationLocale.confirmationMessage = (
            <div>
                {this.props.publicationToClaimFileUploadingError && <Alert {...txt.successWorkflowConfirmation.fileFailConfirmationAlert} />}
                {txt.successWorkflowConfirmation.successConfirmationMessage}
            </div>
        );
        let alertProps;
        if (!publication.rek_pid && this.props.submitFailed) {
            // if creating a new record from external source failed it might be because external source doesn't have full required record data
            // display a custom error message
            alertProps = validation.getErrorAlertProps({...this.props, dirty: true, error: txt.errorAlert.incompleteData, alertLocale: txt});
        } else if (publication.rek_pid && (authorLinked || contributorLinked)) {
            alertProps = {...txt.alreadyClaimedAlert};
        } else {
            alertProps = validation.getErrorAlertProps({...this.props, dirty: true, alertLocale: txt});
        }

        return (
            <StandardPage title={txt.title}>
                <form onSubmit={this._handleDefaultSubmit}>
                    <StandardCard title={txt.claimingInformation.title} help={txt.claimingInformation.help}>
                        <PublicationCitation publication={publication}/>
                    </StandardCard>
                    {
                        (!publication.rek_pid || !(authorLinked || contributorLinked)) &&
                        <div>
                            <ConfirmDialogBox
                                onRef={this._setSuccessConfirmation}
                                onAction={this._navigateToMyResearch}
                                onCancelAction={this._claimAnother}
                                locale={saveConfirmationLocale} />
                            <NavigationDialogBox when={this.props.dirty && !this.props.submitSucceeded} txt={txt.cancelWorkflowConfirmation} />
                            {
                                publication.fez_record_search_key_author &&
                                publication.fez_record_search_key_author.length > 0
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
                            {
                                publication.fez_record_search_key_contributor &&
                                publication.fez_record_search_key_contributor.length > 0 &&
                                !contributorLinked &&
                                <StandardCard
                                    title={txt.contributorLinking.title}
                                    help={txt.contributorLinking.help}
                                    className={contributorClassName}>
                                    <label htmlFor="contributorLinking">{txt.contributorLinking.text}</label>
                                    <Field
                                        name="contributorLinking"
                                        component={ContributorLinkingField}
                                        loggedInAuthor={author}
                                        authorList={publication.fez_record_search_key_contributor}
                                        linkedAuthorIdList={publication.fez_record_search_key_contributor_id}
                                        disabled={this.props.submitting}
                                        className={contributorClassName}
                                        validate={this._contributorValidation}
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
                        alertProps && <Alert {...alertProps} />
                    }
                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                label={txt.cancel}
                                disabled={this.props.submitting}
                                onClick={this._cancelClaim}/>
                        </div>
                        {
                            (!publication.rek_pid || !(authorLinked || contributorLinked)) && !(!publication.rek_pid && this.props.submitFailed) &&
                            <div className="column is-narrow-desktop">
                                <RaisedButton
                                    secondary
                                    fullWidth
                                    label={txt.submit}
                                    onClick={this.props.handleSubmit}
                                    disabled={this.props.submitting || this.props.disableSubmit}/>
                            </div>
                        }
                    </div>
                </form>
            </StandardPage>
        );
    }
}
