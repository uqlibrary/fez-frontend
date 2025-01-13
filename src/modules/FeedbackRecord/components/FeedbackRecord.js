import React, { useEffect, useRef } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as actions from 'actions';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { CheckboxGroup } from 'modules/SharedComponents/Toolbox/CheckboxGroup';
import { RadioGroupField } from 'modules/SharedComponents/Toolbox/RadioGroupField';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { createConfirmDialogBoxRefAssigner } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox/components/ConfirmDialogBox';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import { pathConfig, validation } from 'config';
import { default as pagesLocale } from 'locale/pages';
import { default as formsLocale } from 'locale/forms';
import { default as validationErrors } from 'locale/validationErrors';

import WorkNotFound from 'modules/NotFound/components/WorkNotFound';

import { useValidatedForm } from 'hooks';
import { isEmptyObject } from 'helpers/general';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';

/**
 * @param hasValidationError
 * @return {{}|{formError: string}}
 */
const getFormLevelError = hasValidationError => {
    if (hasValidationError) {
        return { feedbackRecordRequiredField: validationErrors.validationErrorsSummary.feedbackRecordRequiredField };
    }

    return {};
};

const FeedbackRecord = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // route params
    const { pid } = useParams();
    // to allow confirmDialogBox control
    const confirmDialogBoxRef = useRef();
    // constants
    const txtPage = pagesLocale.pages.feedbackRecord;
    const txtForm = formsLocale.forms.feedbackRecord;

    // app's global state
    const { recordToFeedback, loadingRecordToFeedback } = useSelector(state => state.get('feedbackRecordReducer'));

    // form
    const {
        control,
        getPropsForAlert,
        safelyHandleSubmit,
        formState: { isDirty, isSubmitting, isSubmitSuccessful, hasValidationError },
    } = useValidatedForm({
        values: {
            shareDetails: txtForm.details.shareDetails.default,
            lastName: '',
            contactNo: '',
            email: '',
        },
    });

    // watch for changes on all fields, as we have to perform a form level validation below
    const { feedbackTypes, ...data } = useWatch({
        control,
    });

    // load record based on pid
    useEffect(() => {
        if (actions && pid && !recordToFeedback?.rek_pid) {
            dispatch(actions.loadRecordToFeedback(pid));
        }
        return () => actions.clearFeedbackRecord();
    }, [dispatch, pid, recordToFeedback?.rek_pid]);

    // display successful submission dialog
    useEffect(() => {
        if (isSubmitSuccessful) confirmDialogBoxRef.current.showConfirmation();
    }, [isSubmitSuccessful]);

    // loading
    if (loadingRecordToFeedback) {
        return (
            <React.Fragment>
                <InlineLoader message={txtPage.loadingMessage} />
            </React.Fragment>
        );
    }
    // record not found
    if (!loadingRecordToFeedback && !recordToFeedback) {
        return <WorkNotFound />;
    }

    const navigateToMyResearch = () => {
        navigate(pathConfig.records.mine);
    };

    const navigateToRecord = () => {
        navigate(pathConfig.records.view(pid));
    };

    const requiredConditionally = value => {
        return data.shareDetails !== '1' || value.trim() ? undefined : validationErrors.validationErrors.required;
    };

    // dialog & alert
    const formLevelError = getFormLevelError(hasValidationError);
    const alertProps = validation.getErrorAlertProps({
        submitting: isSubmitting,
        submitSucceeded: isSubmitSuccessful,
        alertLocale: txtForm,
        ...getPropsForAlert(formLevelError),
    });

    const onSubmit = safelyHandleSubmit(async () => {
        await dispatch(actions.feedbackRecord(pid, data));
    });

    return (
        <StandardPage title={txtPage.title}>
            <ConfirmDiscardFormChanges dirty={isDirty} isSubmitSuccessful={isSubmitSuccessful}>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <StandardCard>{txtForm.introduction}</StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard>
                                <PublicationCitation
                                    publication={recordToFeedback}
                                    hideContentIndicators
                                    hideCitationCounts
                                    citationStyle={'header'}
                                />
                            </StandardCard>
                        </Grid>
                        <NavigationDialogBox
                            when={isDirty && !isSubmitSuccessful}
                            txt={txtForm.cancelWorkflowConfirmation}
                        />
                        <ConfirmDialogBox
                            onRef={createConfirmDialogBoxRefAssigner(confirmDialogBoxRef)}
                            onAction={navigateToMyResearch}
                            onCancelAction={navigateToRecord}
                            locale={txtForm.successWorkflowConfirmation}
                        />
                        <Grid xs={12}>
                            <StandardCard title={txtForm.details.title}>
                                <Grid container spacing={3}>
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={RadioGroupField}
                                            disabled={isSubmitting}
                                            name="shareDetails"
                                            radioGroupFieldId="share-details"
                                            data-testid="share-details"
                                            rules={{ deps: ['lastName', 'contactNo'] }}
                                            options={txtForm.details.shareDetails.options}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={TextField}
                                            disabled={isSubmitting}
                                            name="firstName"
                                            label={txtForm.details.firstName}
                                            validate={[validation.maxLength255Validator]}
                                            textFieldId="first-name"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={TextField}
                                            disabled={isSubmitting}
                                            name="lastName"
                                            label={txtForm.details.lastName}
                                            validate={[validation.maxLength255Validator, requiredConditionally]}
                                            required={data.shareDetails === '1'}
                                            textFieldId="last-name"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={TextField}
                                            disabled={isSubmitting}
                                            name="contactNo"
                                            label={txtForm.details.contactNo}
                                            validate={[validation.maxLengthValidator(30), requiredConditionally]}
                                            required={data.shareDetails === '1'}
                                            textFieldId="contact-no"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={TextField}
                                            disabled={isSubmitting}
                                            name="email"
                                            label={txtForm.details.email}
                                            validate={[validation.maxLength255Validator, validation.email]}
                                            textFieldId="email"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            control={control}
                                            component={TextField}
                                            disabled={isSubmitting}
                                            name="community"
                                            label={txtForm.details.community}
                                            validate={[validation.maxLength255Validator]}
                                            data-testid="community"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Typography variant={'h6'}>{txtForm.indigenousIdentity.title}</Typography>
                                        <Field
                                            control={control}
                                            component={RadioGroupField}
                                            disabled={isSubmitting}
                                            name="indigenousIdentity"
                                            radioGroupFieldId="indigenous-identity"
                                            data-testid="indigenous-identity"
                                            options={txtForm.indigenousIdentity.options}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Typography variant={'h6'}>{txtForm.hasKinshipConnection.title}</Typography>
                                        <Field
                                            control={control}
                                            component={RadioGroupField}
                                            disabled={isSubmitting}
                                            name="hasKinshipConnection"
                                            radioGroupFieldId="has-kinship-connection"
                                            data-testid="has-kinship-connection"
                                            options={txtForm.hasKinshipConnection.options}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Typography variant={'h6'}>
                                            {txtForm.isICIPHolder.title}
                                            <HelpIcon
                                                {...txtForm.isICIPHolder.helpPanel}
                                                iconSize={'small'}
                                                style={{ marginTop: '-4px' }}
                                            />
                                        </Typography>
                                        <Field
                                            control={control}
                                            component={RadioGroupField}
                                            disabled={isSubmitting}
                                            name="isIcipHolder"
                                            radioGroupFieldId="is-icip-holder"
                                            data-testid="is-icip-holder"
                                            options={txtForm.isICIPHolder.options}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Typography variant={'h6'}>{txtForm.communityParticipant.title}</Typography>
                                        <Field
                                            control={control}
                                            component={RadioGroupField}
                                            disabled={isSubmitting}
                                            name="communityParticipant"
                                            radioGroupFieldId="community-participant"
                                            data-testid="community-participant"
                                            options={txtForm.communityParticipant.options}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txtForm.feedbackTypes.title}>
                                <Field
                                    control={control}
                                    component={CheckboxGroup}
                                    disabled={isSubmitting}
                                    name="feedbackTypes"
                                    checkboxGroupId="feedback-types"
                                    data-testid="feedback-types"
                                    options={txtForm.feedbackTypes.options}
                                />
                            </StandardCard>
                        </Grid>
                        {feedbackTypes?.hasOwnProperty('feedback') && (
                            <Grid xs={12}>
                                <StandardCard>
                                    <Grid container spacing={3}>
                                        <Grid xs={12}>
                                            <Typography variant={'h6'}>{txtForm.communityInfo.title}</Typography>
                                            <Field
                                                control={control}
                                                component={TextField}
                                                disabled={isSubmitting}
                                                name="communityInfo"
                                                label={txtForm.communityInfo.subTitle}
                                                validate={[validation.maxLengthValidator(2000)]}
                                                textFieldId="community-info"
                                                variant={'outlined'}
                                                multiline
                                                rows={5}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid xs={12}>
                                            <Typography variant={'h6'}>{txtForm.relatedPeople.title}</Typography>
                                            <Field
                                                control={control}
                                                component={TextField}
                                                disabled={isSubmitting}
                                                name="relatedPeople"
                                                label={txtForm.relatedPeople.subTitle}
                                                validate={[validation.maxLengthValidator(2000)]}
                                                textFieldId="related-people"
                                                variant={'outlined'}
                                                multiline
                                                rows={5}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        )}
                        {feedbackTypes?.hasOwnProperty('story') && (
                            <Grid xs={12}>
                                <StandardCard>
                                    <Typography variant={'h6'}>{txtForm.story.title}</Typography>
                                    <Field
                                        control={control}
                                        component={TextField}
                                        disabled={isSubmitting}
                                        validate={[validation.maxLengthValidator(2000)]}
                                        name="story"
                                        textFieldId="story"
                                        multiline
                                        rows={5}
                                        variant={'outlined'}
                                        fullWidth
                                    />
                                </StandardCard>
                            </Grid>
                        )}
                        {feedbackTypes?.hasOwnProperty('takedown') && (
                            <Grid xs={12}>
                                <StandardCard>
                                    <Grid container spacing={3} padding={0}>
                                        <Grid xs={12}>
                                            <Typography variant={'h6'}>{txtForm.culturalInfo.title}</Typography>
                                            <Field
                                                control={control}
                                                component={CheckboxGroup}
                                                disabled={isSubmitting}
                                                name="culturalInfo"
                                                checkboxGroupId="cultural-info"
                                                data-testid="cultural-info"
                                                options={txtForm.culturalInfo.options}
                                            />
                                        </Grid>
                                        <Grid xs={12}>
                                            <Typography variant={'h6'}>{txtForm.specialCare.title}</Typography>
                                            <Field
                                                control={control}
                                                component={CheckboxGroup}
                                                disabled={isSubmitting}
                                                name="specialCare"
                                                checkboxGroupId="special-care"
                                                data-testid="special-care"
                                                options={txtForm.specialCare.options}
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        )}
                        <Grid xs={12}>
                            <StandardCard>
                                <Grid container spacing={3}>
                                    <Grid xs={12}>
                                        <Typography variant={'h6'}>{txtForm.acknowledgement.title}</Typography>
                                        <Field
                                            control={control}
                                            component={RadioGroupField}
                                            disabled={isSubmitting}
                                            name="acknowledgement"
                                            radioGroupFieldId="acknowledgement"
                                            data-testid="acknowledgement"
                                            options={txtForm.acknowledgement.options}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Typography sx={{ fontStyle: 'italic' }} variant={'body1'}>
                                            {txtForm.acknowledgement.disclaimer}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {alertProps && (
                            <Grid xs={12}>
                                <Alert pushToTop {...alertProps} />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid xs />
                        <Grid>
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={txtForm.cancel}
                                disabled={isSubmitting}
                                onClick={navigateToRecord}
                                color={'default'}
                            />
                        </Grid>
                        <Grid>
                            <Button
                                type="submit"
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                children={txtForm.submit}
                                disabled={isSubmitting || !isEmptyObject(formLevelError) || hasValidationError}
                                id="feedback-submit"
                                data-testid="feedback-submit"
                                data-analyticsid="feedback-submit"
                            />
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};

export default FeedbackRecord;
