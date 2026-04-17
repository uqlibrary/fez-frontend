import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
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
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';
import { useValidatedForm } from '../../../hooks';
import { Field } from '../../SharedComponents/Toolbox/ReactHookForm';
import { createConfirmDialogBoxRefAssigner } from '../../SharedComponents/Toolbox/ConfirmDialogBox/components/ConfirmDialogBox';

const isClaimPreCheckResponse = errors => errors?.original?.request?.responseURL?.includes?.(CLAIM_PRE_CHECK().apiUrl);
const getCustomErrorMessageIfAvailable = (serverError, defaultMessage) => {
    if (isClaimPreCheckResponse(serverError) && serverError?.original?.data) {
        return serverError.original.data;
    }
    return defaultMessage;
};

export const getAlertProps = (
    publication,
    authorLinked,
    contributorLinked,
    getPropsForAlert,
    isSubmitting,
    isSubmitSuccessful,
    isSubmitFailure,
    serverError,
) => {
    const txt = locale.forms.claimPublicationForm;
    // When trying to claim a record from an external source, the available
    // data might not be sufficient for creating a new record. This scenario
    // would be handled up by the code block below.
    if (!publication.rek_pid && isSubmitFailure) {
        return validation.getErrorAlertProps({
            submitting: isSubmitting,
            submitSucceeded: isSubmitSuccessful,
            error: getCustomErrorMessageIfAvailable(serverError, txt.errorAlert.incompleteData),
            dirty: true,
            alertLocale: txt,
        });
    }

    if (publication?.rek_pid && (authorLinked || contributorLinked)) {
        return { ...txt.alreadyClaimedAlert };
    }

    return validation.getErrorAlertProps({
        submitting: isSubmitting,
        submitSucceeded: isSubmitSuccessful,
        dirty: true,
        alertLocale: txt,
        ...getPropsForAlert(),
    });
};

const ClaimRecord = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // to allow confirmDialogBox control
    const confirmDialogBoxRef = useRef();
    // constants
    const txt = locale.forms.claimPublicationForm;
    // app's global state
    const {
        publicationToClaim,
        fullPublicationToClaim,
        fullPublicationToClaimLoading,
        publicationToClaimFileUploadingError,
    } = useSelector(state => state.get('claimPublicationReducer'));
    const { author } = useSelector(state => state.get('accountReducer'));
    const { redirectPath } = useSelector(state => state.get('appReducer'));

    const contentIndicators = useMemo(
        () =>
            fullPublicationToClaim?.fez_record_search_key_content_indicator?.map?.(
                item => item.rek_content_indicator,
            ) || [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(fullPublicationToClaim?.fez_record_search_key_content_indicator)],
    );

    const publication = {
        ...publicationToClaim,
        ...fullPublicationToClaim,
        contentIndicators,
    };

    const {
        control,
        setValue,
        resetField,
        safelyHandleSubmit,
        getPropsForAlert,
        mergeWithFormValues,
        formState: { isDirty, isSubmitting, isSubmitSuccessful, isSubmitFailure, hasError, serverError },
    } = useValidatedForm({
        defaultValues: {
            authorLinking: '',
            contributorLinking: '',
            comments: '',
            rek_link: '',
            contentIndicators,
            files: [],
        },
    });

    useEffect(
        () => {
            if (!author?.aut_id || !publication) {
                navigate(-1);
            }

            if (publication?.rek_pid && actions) {
                dispatch(actions.loadFullRecordToClaim(publication.rek_pid));
            }

            return () => dispatch(actions.clearClaimPublication());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [author?.aut_id, publication?.rek_pid, navigate],
    );

    // Update contentIndicators field's default value once the record is loaded.
    // This is required to properly render the field with already selected
    // content indicators as disabled options.
    useEffect(() => {
        resetField('contentIndicators', { defaultValue: contentIndicators });
    }, [setValue, resetField, contentIndicators]);

    useEffect(() => {
        if (isSubmitSuccessful) confirmDialogBoxRef.current.showConfirmation();
    }, [isSubmitSuccessful]);

    if (!author) return null;
    if (fullPublicationToClaimLoading) {
        return (
            <StandardPage>
                <Grid container>
                    <Grid size={12}>
                        <InlineLoader message={txt.publicationLoading} />
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }

    const onSubmit = safelyHandleSubmit(
        async () => await dispatch(actions.claimPublication(mergeWithFormValues({ author, publication }))),
    );
    // validation
    const contributorValidation = link => {
        const hasAuthors = !!publication?.fez_record_search_key_author?.length;
        return validation.isValidContributorLink(link, !hasAuthors);
    };
    // navigation
    const navigateToMyResearch = () => navigate(pathConfig.records.mine);
    const navigateToFixRecord = () => navigate(pathConfig.records.fix(publication.rek_pid));
    const claimAnother = () => {
        if (!!redirectPath) {
            navigate(redirectPath);
            dispatch(actions.clearNewRecord());
            dispatch(actions.clearRedirectPath());
        } else {
            navigate(-1);
        }
    };
    const cancelClaim = () => {
        dispatch(actions.clearNewRecord());
        navigate(-1);
    };

    // dialog & alert
    const authorLinked = publication?.fez_record_search_key_author_id?.some(id => id.rek_author_id === author.aut_id);
    const contributorLinked = publication?.fez_record_search_key_contributor_id?.some(
        id => id.rek_contributor_id === author.aut_id,
    );
    const alertProps = getAlertProps(
        publication,
        authorLinked,
        contributorLinked,
        getPropsForAlert,
        isSubmitting,
        isSubmitSuccessful,
        isSubmitFailure,
        serverError,
    );
    // set confirmation message depending on file upload status
    const saveConfirmationLocale = { ...txt.successWorkflowConfirmation };
    saveConfirmationLocale.confirmationMessage = (
        <React.Fragment>
            {publicationToClaimFileUploadingError && (
                <Grid container>
                    <Grid size={12}>
                        <Alert pushToTop {...txt.successWorkflowConfirmation.fileFailConfirmationAlert} />
                    </Grid>
                </Grid>
            )}
            {txt.successWorkflowConfirmation.successConfirmationMessage}
        </React.Fragment>
    );
    const contributorClassName = publication?.fez_record_search_key_author?.length
        ? 'contributorsField'
        : 'requiredField';

    return (
        <StandardPage title={txt.title}>
            <ConfirmDiscardFormChanges dirty={isDirty} submitSucceeded={isSubmitSuccessful}>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <StandardCard title={txt.claimingInformation.title} help={txt.claimingInformation.help}>
                                <PublicationCitation publication={publication} citationStyle="header" />
                            </StandardCard>
                        </Grid>
                        {(!publication.rek_pid || !(authorLinked || contributorLinked)) && (
                            <>
                                <ConfirmDialogBox
                                    locale={saveConfirmationLocale}
                                    onRef={createConfirmDialogBoxRefAssigner(confirmDialogBoxRef)}
                                    onAction={navigateToMyResearch}
                                    onAlternateAction={navigateToFixRecord}
                                    onCancelAction={claimAnother}
                                    showAlternateActionButton={!!publicationToClaimFileUploadingError}
                                />
                                <NavigationDialogBox
                                    when={isDirty && !isSubmitSuccessful}
                                    txt={txt.cancelWorkflowConfirmation}
                                />
                                {publication.fez_record_search_key_author &&
                                    publication.fez_record_search_key_author.length > 0 &&
                                    !authorLinked && (
                                        <Grid size={12}>
                                            <StandardCard
                                                title={txt.authorLinking.title}
                                                help={txt.authorLinking.help}
                                                className="requiredField"
                                            >
                                                <label htmlFor="authorLinking">{txt.authorLinking.text}</label>
                                                <Field
                                                    control={control}
                                                    name="authorLinking"
                                                    component={AuthorLinkingField}
                                                    loggedInAuthor={author}
                                                    authorList={publication.fez_record_search_key_author}
                                                    linkedAuthorIdList={publication.fez_record_search_key_author_id}
                                                    disabled={isSubmitting}
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
                                        <Grid size={12}>
                                            <StandardCard
                                                title={txt.contributorLinking.title}
                                                help={txt.contributorLinking.help}
                                                className={contributorClassName}
                                            >
                                                <label htmlFor="contributorLinking">
                                                    {txt.contributorLinking.text}
                                                </label>
                                                <Field
                                                    control={control}
                                                    name="contributorLinking"
                                                    component={ContributorLinkingField}
                                                    loggedInAuthor={author}
                                                    authorList={publication.fez_record_search_key_contributor}
                                                    linkedAuthorIdList={
                                                        publication.fez_record_search_key_contributor_id
                                                    }
                                                    disabled={isSubmitting}
                                                    className={contributorClassName}
                                                    validate={[contributorValidation]}
                                                />
                                            </StandardCard>
                                        </Grid>
                                    )}
                                <Grid size={12}>
                                    <StandardCard title={txt.comments.title} help={txt.comments.help}>
                                        <Grid container spacing={2}>
                                            <Grid size={12}>
                                                <Field
                                                    control={control}
                                                    component={TextField}
                                                    textFieldId="claim-comments"
                                                    disabled={isSubmitting}
                                                    name="comments"
                                                    type="text"
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    label={txt.comments.fieldLabels.comments}
                                                />
                                            </Grid>
                                            <Grid size={12}>
                                                <Field
                                                    control={control}
                                                    component={TextField}
                                                    textFieldId="claim-link"
                                                    disabled={isSubmitting}
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
                                    <Grid size={12}>
                                        <StandardCard
                                            title={txt.contentIndicators.title}
                                            help={txt.contentIndicators.help}
                                        >
                                            <Grid container spacing={3}>
                                                <Grid size={12}>
                                                    <Typography>{txt.contentIndicators.description}</Typography>
                                                </Grid>
                                                <Grid size={12}>
                                                    <Field
                                                        control={control}
                                                        component={ContentIndicatorsField}
                                                        displayType={publication.rek_display_type}
                                                        disabled={isSubmitting}
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
                                <Grid size={12}>
                                    <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                                        <Field
                                            control={control}
                                            name="files"
                                            component={FileUploadField}
                                            disabled={isSubmitting}
                                            requireOpenAccessStatus
                                            validate={[validation.validFileUpload]}
                                        />
                                    </StandardCard>
                                </Grid>
                            </>
                        )}
                        {alertProps && (
                            <Grid size={12}>
                                <Alert {...alertProps} />
                            </Grid>
                        )}
                    </Grid>
                    <Grid
                        container
                        spacing={2}
                        padding={2}
                        sx={{ justifyContent: 'flex-end', pr: 0, pl: { xs: 0, sm: 'auto' } }}
                    >
                        <Grid
                            size={{
                                xs: 12,
                                sm: 'auto',
                            }}
                        >
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={txt.cancel}
                                disabled={isSubmitting}
                                onClick={cancelClaim}
                                color={'default'}
                                sx={{ sm: { width: 'auto' } }}
                            />
                        </Grid>
                        {(!publication.rek_pid || !(authorLinked || contributorLinked)) &&
                            !(!publication.rek_pid && isSubmitFailure) && (
                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 'auto',
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant={'contained'}
                                        color={'primary'}
                                        fullWidth
                                        children={txt.submit}
                                        disabled={isSubmitting || hasError}
                                        id="claimSubmit"
                                        data-testid="claim-record-submit"
                                        data-analyticsid="claimSubmit"
                                        sx={{ sm: { width: 'auto' } }}
                                    />
                                </Grid>
                            )}
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};

export default ClaimRecord;
