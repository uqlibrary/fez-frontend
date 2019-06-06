import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import {
    AuthorLinkingField,
    ContributorLinkingField
} from 'modules/SharedComponents/AuthorLinking';
import {
    ContentIndicatorsField,
    showContentIndicatorsField
} from 'modules/SharedComponents/Toolbox/ContentIndicatorsField';
import { validation, routes, claimRecordConfig } from 'config';
import locale from 'locale/forms';

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
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    componentWillMount() {
        const author = this.props.initialValues.get('author')
            ? this.props.initialValues.get('author').toJS()
            : null
        ;

        const publication = this.props.initialValues.get('publication')
            ? this.props.initialValues.get('publication').toJS()
            : null
        ;

        if (!author || !publication) {
            this.props.history.go(-1);
        }
    }

    componentDidMount() {
        const publication = this.props.initialValues.get('publication') ? this.props.initialValues.get('publication').toJS() : null;
        if (publication && publication.rek_pid && this.props.actions) {
            this.props.actions.loadFullRecordToClaim(publication.rek_pid);
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
        !!event && event.preventDefault();
    };

    _contributorValidation = (link) => {
        const publication = this.props.initialValues.get('publication').toJS();
        return publication.fez_record_search_key_author && publication.fez_record_search_key_author.length > 0 ?
            validation.isValidContributorLink(link) : validation.isValidContributorLink(link, true);
    };

    render() {
        const txt = locale.forms.claimPublicationForm;

        const publication = {
            ...(
                this.props.initialValues.get('publication') &&
                this.props.initialValues.get('publication').toJS(0)
            ),
            ...this.props.fullPublicationToClaim
        };

        const author = this.props.initialValues.get('author')
            ? this.props.initialValues.get('author').toJS()
            : null
        ;

        if (!author) {
            return (<div />);
        }
        if (!publication || this.props.fullPublicationToClaimLoading) {
            return (
                <StandardPage>
                    <Grid container>
                        <Grid item xs={12}>
                            <InlineLoader message={txt.publicationLoading} />
                        </Grid>
                    </Grid>
                </StandardPage>
            );
        }

        const authorLinked = publication &&
            author &&
            publication.fez_record_search_key_author_id &&
            publication.fez_record_search_key_author_id.some(
                authorId => authorId.rek_author_id === author.aut_id
            )
        ;

        const contributorLinked = publication &&
            author &&
            publication.fez_record_search_key_contributor_id &&
            publication.fez_record_search_key_contributor_id.some(
                contributorId => contributorId.rek_contributor_id === author.aut_id
            )
        ;

        const contributorClassName = (
            publication.fez_record_search_key_author &&
            publication.fez_record_search_key_author.length > 0
        )
            ? 'contributorsField'
            : 'requiredField'
        ;

        // if publication.sources is set, user is claiming from Add missing record page
        const fromAddRecord = !!publication.sources;
        // set confirmation message depending on file upload status and publication fromAddRecord
        const saveConfirmationLocale = { ...txt.successWorkflowConfirmation };

        saveConfirmationLocale.cancelButtonLabel = fromAddRecord
            ? txt.successWorkflowConfirmation.addRecordButtonLabel
            : txt.successWorkflowConfirmation.cancelButtonLabel;

        saveConfirmationLocale.confirmationMessage = (
            <React.Fragment>
                {
                    this.props.publicationToClaimFileUploadingError &&
                    <Grid container>
                        <Grid item xs={12}>
                            <Alert
                                pushToTop
                                { ...txt.successWorkflowConfirmation.fileFailConfirmationAlert }
                            />
                        </Grid>
                    </Grid>
                }
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
                dirty: true,
                error: txt.errorAlert.incompleteData,
                alertLocale: txt
            });
        } else if (publication.rek_pid && (authorLinked || contributorLinked)) {
            alertProps = { ...txt.alreadyClaimedAlert };
        } else {
            alertProps = validation.getErrorAlertProps({
                ...this.props,
                dirty: true,
                alertLocale: txt
            });
        }

        return (
            <StandardPage title={txt.title}>
                <form onSubmit={this._handleDefaultSubmit}>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard
                                title={txt.claimingInformation.title}
                                help={txt.claimingInformation.help}
                            >
                                <PublicationCitation publication={publication} />
                            </StandardCard>
                        </Grid>
                        {
                            (!publication.rek_pid || !(authorLinked || contributorLinked)) &&
                            <React.Fragment>
                                <ConfirmDialogBox
                                    onRef={this._setSuccessConfirmation}
                                    onAction={this._navigateToMyResearch}
                                    onCancelAction={this._claimAnother}
                                    locale={saveConfirmationLocale} />
                                <NavigationDialogBox
                                    when={this.props.dirty && !this.props.submitSucceeded}
                                    txt={txt.cancelWorkflowConfirmation}
                                />
                                {
                                    publication.fez_record_search_key_author &&
                                    publication.fez_record_search_key_author.length > 0
                                    && !authorLinked &&
                                    <Grid item xs={12}>
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
                                    </Grid>
                                }
                                {
                                    !claimRecordConfig.hideContributorLinking.includes(publication.rek_display_type) &&
                                    publication.fez_record_search_key_contributor &&
                                    publication.fez_record_search_key_contributor.length > 0 &&
                                    !contributorLinked &&
                                    <Grid item xs={12}>
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
                                    </Grid>
                                }
                                {
                                    showContentIndicatorsField(publication) &&
                                    <Grid item xs={12}>
                                        <StandardCard title={txt.contentIndicators.title} >
                                            <Grid container spacing={24}>
                                                <Grid item xs={12}>
                                                    <Typography>{txt.contentIndicators.description}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={ContentIndicatorsField}
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
                                }
                                <Grid item xs={12}>
                                    <StandardCard title={txt.comments.title} help={txt.comments.help}>
                                        <Grid container spacing={16}>
                                            <Grid item xs={12}>
                                                <Field
                                                    component={TextField}
                                                    disabled={this.props.submitting}
                                                    name="comments"
                                                    type="text"
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    label={txt.comments.fieldLabels.comments} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field
                                                    component={TextField}
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
                                <Grid item xs={12}>
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
                        }
                        {
                            alertProps &&
                            <Grid item xs={12}>
                                <Alert pushToTop {...alertProps} />
                            </Grid>
                        }
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item xs />
                        <Grid item>
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={txt.cancel}
                                disabled={this.props.submitting}
                                onClick={this._cancelClaim} />
                        </Grid>
                        {
                            (
                                !publication.rek_pid ||
                                !(authorLinked || contributorLinked)
                            ) && !(
                                !publication.rek_pid &&
                                this.props.submitFailed
                            ) &&
                            <Grid item>
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    fullWidth
                                    children={txt.submit}
                                    onClick={this.props.handleSubmit}
                                    disabled={this.props.submitting || this.props.disableSubmit}
                                />
                            </Grid>
                        }
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
