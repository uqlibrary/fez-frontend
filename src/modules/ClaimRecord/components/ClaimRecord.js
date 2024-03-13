import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form/immutable';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';

import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { AuthorLinkingField, ContributorLinkingField } from 'modules/SharedComponents/AuthorLinking';
import {
    ContentIndicatorsField,
    showContentIndicatorsField,
} from 'modules/SharedComponents/Toolbox/ContentIndicatorsField';
import { claimRecordConfig, pathConfig, validation } from 'config';
import locale from 'locale/forms';
import { CLAIM_PRE_CHECK } from 'repositories/routes';

export const isClaimPreCheckResponse = error => error?.request?.responseURL?.includes?.(CLAIM_PRE_CHECK().apiUrl);

export default class ClaimRecord extends PureComponent {
    static propTypes = {
        ...propTypes, // all redux-form props
        disableSubmit: PropTypes.bool,

        fullPublicationToClaim: PropTypes.object,
        fullPublicationToClaimLoading: PropTypes.bool,
        fullPublicationToClaimLoadingFailed: PropTypes.any,

        publicationToClaimFileUploadingError: PropTypes.bool,
        publicationFailedToClaim: PropTypes.string,
        redirectPath: PropTypes.string,
        navigate: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        const author = this.props.initialValues.get('author') ? this.props.initialValues.get('author').toJS() : null;
        const publication = this.props.initialValues.get('publication')
            ? this.props.initialValues.get('publication').toJS()
            : null;

        if (!author || !publication) {
            this.props.navigate(-1);
        }
    }
    componentDidMount() {
        const publication = this.props.initialValues.get('publication')
            ? this.props.initialValues.get('publication').toJS()
            : null;

        if (publication && publication.rek_pid && this.props.actions) {
            this.props.actions.loadFullRecordToClaim(publication.rek_pid);
        }
    }

    componentDidUpdate(prevProps) {
        /* istanbul ignore else */
        if (prevProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox.showConfirmation();
        }
    }
    componentWillUnmount() {
        // clear previously selected publication for a claim
        this.props.actions.clearClaimPublication();
    }

    _navigateToMyResearch = () => {
        this.props.navigate(pathConfig.records.mine);
    };

    _cancelClaim = () => {
        this.props.actions.clearNewRecord();
        this.props.navigate(-1);
    };

    _claimAnother = () => {
        if (!!this.props.redirectPath) {
            this.props.navigate(this.props.redirectPath);
            this.props.actions.clearNewRecord();
            this.props.actions.clearRedirectPath();
        } else {
            this.props.navigate(-1);
        }
    };

    _setSuccessConfirmation = ref => {
        this.successConfirmationBox = ref;
    };
    /* istanbul ignore next */
    _handleDefaultSubmit = event => {
        !!event && event.preventDefault();
    };

    _contributorValidation = link => {
        const publication =
            this.props.initialValues.get('publication') &&
            this.props.initialValues.get('publication').toJS &&
            this.props.initialValues.get('publication').toJS();
        return publication &&
            publication.fez_record_search_key_author &&
            publication.fez_record_search_key_author.length > 0
            ? validation.isValidContributorLink(link)
            : validation.isValidContributorLink(link, true);
    };

    _navigateToFixRecord = () => {
        this.props.navigate(pathConfig.records.fix(this._publication().rek_pid));
    };

    _publication = () => {
        return {
            ...(this.props.initialValues.get('publication') && this.props.initialValues.get('publication').toJS(0)),
            ...this.props.fullPublicationToClaim,
        };
    };

    _useCustomErrorMessageIfAvailable = (error, defaultMessage) => {
        if (error?.original?.data && typeof error?.original?.data === 'string' && isClaimPreCheckResponse(error)) {
            return error.original.data;
        }

        return defaultMessage;
    };

    render() {
        const txt = locale.forms.claimPublicationForm;

        const publication = this._publication();
        const author = this.props.initialValues.get('author') ? this.props.initialValues.get('author').toJS() : null;

        if (!author) {
            return <div />;
        }

        if (!publication || this.props.fullPublicationToClaimLoading) {
            return (
                <StandardPage>
                    <Grid container>
                        <Grid xs={12}>
                            <InlineLoader message={txt.publicationLoading} />
                        </Grid>
                    </Grid>
                </StandardPage>
            );
        }

        const authorLinked =
            publication &&
            author &&
            Array.isArray(publication.fez_record_search_key_author_id) &&
            publication.fez_record_search_key_author_id.some(authorId => authorId.rek_author_id === author.aut_id);
        const contributorLinked =
            publication &&
            author &&
            Array.isArray(publication.fez_record_search_key_contributor_id) &&
            publication.fez_record_search_key_contributor_id.some(
                contributorId => contributorId.rek_contributor_id === author.aut_id,
            );
        const contributorClassName =
            publication.fez_record_search_key_author && publication.fez_record_search_key_author.length > 0
                ? 'contributorsField'
                : 'requiredField';
        // if publication.sources is set, user is claiming from Add missing record page
        const fromAddRecord = !!publication.sources;
        // set confirmation message depending on file upload status and publication fromAddRecord
        const saveConfirmationLocale = { ...txt.successWorkflowConfirmation };

        saveConfirmationLocale.cancelButtonLabel = fromAddRecord
            ? txt.successWorkflowConfirmation.addRecordButtonLabel
            : txt.successWorkflowConfirmation.cancelButtonLabel;

        saveConfirmationLocale.confirmationMessage = (
            <React.Fragment>
                {this.props.publicationToClaimFileUploadingError && (
                    <Grid container>
                        <Grid xs={12}>
                            <Alert pushToTop {...txt.successWorkflowConfirmation.fileFailConfirmationAlert} />
                        </Grid>
                    </Grid>
                )}
                {txt.successWorkflowConfirmation.successConfirmationMessage}
            </React.Fragment>
        );
        let alertProps;
        if (!publication.rek_pid && this.props.submitFailed) {
            // if creating a new record from external source failed it might be
            // because external source doesn't have full required record data
            // display a custom error message
            alertProps = validation.getErrorAlertProps({
                ...this.props,
                error: this._useCustomErrorMessageIfAvailable(this.props.error, txt.errorAlert.incompleteData),
                dirty: true,
                alertLocale: txt,
            });
        } else if (publication.rek_pid && (authorLinked || contributorLinked)) {
            alertProps = { ...txt.alreadyClaimedAlert };
        } else {
            alertProps = validation.getErrorAlertProps({
                ...this.props,
                error: this.props.error?.message || this.props.error,
                dirty: true,
                alertLocale: txt,
            });
        }

        return (
            <StandardPage title={txt.title}>
                <ConfirmDiscardFormChanges dirty={this.props.dirty} submitSucceeded={this.props.submitSucceeded}>
                    <form onSubmit={this._handleDefaultSubmit}>
                        <Grid container spacing={3}>
                            <Grid xs={12}>
                                <StandardCard title={txt.claimingInformation.title} help={txt.claimingInformation.help}>
                                    <PublicationCitation publication={publication} citationStyle={'header'} />
                                </StandardCard>
                            </Grid>
                            {(!publication.rek_pid || !(authorLinked || contributorLinked)) && (
                                <React.Fragment>
                                    <ConfirmDialogBox
                                        locale={saveConfirmationLocale}
                                        onRef={this._setSuccessConfirmation}
                                        onAction={this._navigateToMyResearch}
                                        onAlternateAction={this._navigateToFixRecord}
                                        onCancelAction={this._claimAnother}
                                        showAlternateActionButton={this.props.publicationToClaimFileUploadingError}
                                    />
                                    <NavigationDialogBox
                                        when={this.props.dirty && !this.props.submitSucceeded}
                                        txt={txt.cancelWorkflowConfirmation}
                                    />
                                    {publication.fez_record_search_key_author &&
                                        publication.fez_record_search_key_author.length > 0 &&
                                        !authorLinked && (
                                            <Grid xs={12}>
                                                <StandardCard
                                                    title={txt.authorLinking.title}
                                                    help={txt.authorLinking.help}
                                                    className="requiredField"
                                                >
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
                                            </Grid>
                                        )}
                                    {!claimRecordConfig.hideContributorLinking.includes(publication.rek_display_type) &&
                                        publication.fez_record_search_key_contributor &&
                                        publication.fez_record_search_key_contributor.length > 0 &&
                                        !contributorLinked && (
                                            <Grid xs={12}>
                                                <StandardCard
                                                    title={txt.contributorLinking.title}
                                                    help={txt.contributorLinking.help}
                                                    className={contributorClassName}
                                                >
                                                    <label htmlFor="contributorLinking">
                                                        {txt.contributorLinking.text}
                                                    </label>
                                                    <Field
                                                        name="contributorLinking"
                                                        component={ContributorLinkingField}
                                                        loggedInAuthor={author}
                                                        authorList={publication.fez_record_search_key_contributor}
                                                        linkedAuthorIdList={
                                                            publication.fez_record_search_key_contributor_id
                                                        }
                                                        disabled={this.props.submitting}
                                                        className={contributorClassName}
                                                        validate={this._contributorValidation}
                                                    />
                                                </StandardCard>
                                            </Grid>
                                        )}
                                    <Grid xs={12}>
                                        <StandardCard title={txt.comments.title} help={txt.comments.help}>
                                            <Grid container spacing={2}>
                                                <Grid xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        textFieldId="claim-comments"
                                                        disabled={this.props.submitting}
                                                        name="comments"
                                                        type="text"
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        label={txt.comments.fieldLabels.comments}
                                                    />
                                                </Grid>
                                                <Grid xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        textFieldId="claim-link"
                                                        disabled={this.props.submitting}
                                                        name="rek_link"
                                                        type="text"
                                                        fullWidth
                                                        label={txt.comments.fieldLabels.url}
                                                        validate={[validation.url]}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </StandardCard>
                                    </Grid>
                                    {showContentIndicatorsField(publication) && (
                                        <Grid xs={12}>
                                            <StandardCard
                                                title={txt.contentIndicators.title}
                                                help={txt.contentIndicators.help}
                                            >
                                                <Grid container spacing={3}>
                                                    <Grid xs={12}>
                                                        <Typography>{txt.contentIndicators.description}</Typography>
                                                    </Grid>
                                                    <Grid xs={12}>
                                                        <Field
                                                            component={ContentIndicatorsField}
                                                            displayType={publication.rek_display_type}
                                                            disabled={this.props.submitting}
                                                            id="content-indicators"
                                                            name="contentIndicators"
                                                            label={txt.contentIndicators.label}
                                                            multiple
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </StandardCard>
                                        </Grid>
                                    )}
                                    <Grid xs={12}>
                                        <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                                            <Field
                                                name="files"
                                                component={FileUploadField}
                                                disabled={this.props.submitting}
                                                requireOpenAccessStatus
                                                validate={[validation.validFileUpload]}
                                            />
                                        </StandardCard>
                                    </Grid>
                                </React.Fragment>
                            )}
                            {alertProps && (
                                <Grid xs={12}>
                                    <Alert pushToTop {...alertProps} />
                                </Grid>
                            )}
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid xs sx={{ display: { xs: 'none', sm: 'block' } }} />
                            <Grid xs={12} sm={'auto'}>
                                <Button
                                    variant={'contained'}
                                    fullWidth
                                    children={txt.cancel}
                                    disabled={this.props.submitting}
                                    onClick={this._cancelClaim}
                                    color={'default'}
                                />
                            </Grid>
                            {(!publication.rek_pid || !(authorLinked || contributorLinked)) &&
                                !(!publication.rek_pid && this.props.submitFailed) && (
                                    <Grid xs={12} sm={'auto'}>
                                        <Button
                                            variant={'contained'}
                                            color={'primary'}
                                            fullWidth
                                            children={txt.submit}
                                            onClick={this.props.handleSubmit}
                                            disabled={this.props.submitting || this.props.disableSubmit}
                                            id="claimSubmit"
                                            data-analyticsid="claimSubmit"
                                        />
                                    </Grid>
                                )}
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </StandardPage>
        );
    }
}
