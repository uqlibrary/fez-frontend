import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {
    ContentIndicatorsField,
    showContentIndicatorsField,
} from 'modules/SharedComponents/Toolbox/ContentIndicatorsField';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { pathConfig, validation } from 'config';
import { default as pagesLocale } from 'locale/pages';
import { default as formsLocale } from 'locale/forms';
import WorkNotFound from 'modules/NotFound/components/WorkNotFound';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as actions from 'actions';
import { useValidatedForm } from '../../../hooks';
import { createConfirmDialogBoxRefAssigner } from '../../SharedComponents/Toolbox/ConfirmDialogBox/components/ConfirmDialogBox';
import { Field } from '../../SharedComponents/Toolbox/ReactHookForm';
import { useWatch } from 'react-hook-form';
import validationErrors from '../../../locale/validationErrors';
import { isEmptyObject } from '../../../helpers/general';

// constants
const RECORD_ACTION_FIX = 'fix';
const RECORD_ACTION_UNCLAIM = 'unclaim';

/**
 * @param author
 * @param recordToFix
 * @param searchKey
 * @param subkey
 * @return {false|*|boolean}
 */
const isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
    return (
        !!author?.aut_id &&
        !!recordToFix &&
        recordToFix[searchKey] &&
        recordToFix[searchKey].length > 0 &&
        recordToFix[searchKey].filter(authorId => authorId[subkey] === author.aut_id).length > 0
    );
};

/**
 * @param author
 * @param recordToFix
 * @return {*|boolean}
 */
const isAuthorLinked = (author, recordToFix) => {
    const isAuthorLinked = isLoggedInUserLinked(
        author,
        recordToFix,
        'fez_record_search_key_author_id',
        'rek_author_id',
    );
    const isContributorLinked = isLoggedInUserLinked(
        author,
        recordToFix,
        'fez_record_search_key_contributor_id',
        'rek_contributor_id',
    );

    return isAuthorLinked || isContributorLinked;
};

/**
 * @param data
 * @return {{}|{formError: string}}
 */
const getFormLevelError = data => {
    if (data.fixAction !== RECORD_ACTION_FIX) {
        return {};
    }

    const originalContentIndicators =
        data.publication?.fez_record_search_key_content_indicator?.map(item => item.rek_content_indicator) || [];

    const hasAddedContentIndicators =
        data.contentIndicators &&
        data.contentIndicators.some(indicator => originalContentIndicators.indexOf(indicator) === -1);

    if (!hasAddedContentIndicators && !data.comments && !data.rek_link && !data.files?.queue?.length) {
        return {
            fixRecordAnyField: validationErrors.validationErrorsSummary.fixRecordAnyField,
        };
    }

    return {};
};

const fixOptions = pagesLocale.pages.fixRecord.actionsOptions.map((item, index) => (
    <MenuItem value={item.action} children={item.title} key={`fix_record_action_${index}`} />
));

const saveConfirmationLocale = { ...formsLocale.forms.fixPublicationForm.successWorkflowConfirmation };

const FixRecord = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // route params
    const { pid } = useParams();
    // to allow confirmDialogBox control
    const confirmDialogBoxRef = useRef();
    // constants
    const txt = pagesLocale.pages.fixRecord;
    const txtFixForm = formsLocale.forms.fixPublicationForm;
    const txtUnclaimForm = formsLocale.forms.unclaimPublicationForm;
    // app's global state
    const { author, accountAuthorLoading } = useSelector(state => state.get('accountReducer'));
    const { recordToFix, loadingRecordToFix } = useSelector(state => state.get('fixRecordReducer'));
    const contentIndicators = useMemo(
        () => recordToFix?.fez_record_search_key_content_indicator?.map?.(item => item.rek_content_indicator) || [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(recordToFix?.fez_record_search_key_content_indicator)],
    );
    const publication = { ...recordToFix, contentIndicators };
    // form
    const {
        control,
        resetField,
        getPropsForAlert,
        mergeWithFormValues,
        safelyHandleSubmit,
        formState: { isDirty, isSubmitting, isSubmitSuccessful, hasValidationError },
    } = useValidatedForm({
        // use values instead of defaultValues, as the first triggers a re-render upon updates
        values: {
            fixAction: '',
            comments: '',
            rek_link: '',
            contentIndicators,
            files: '',
        },
    });
    // watch for changes on all fields, as we have to perform a form level validation below
    const { fixAction, ...data } = useWatch({
        control,
    });
    // load record to fix based pid, extracted from URL
    useEffect(() => {
        if (actions && pid && recordToFix?.rek_pid !== pid) {
            dispatch(actions.loadRecordToFix(pid));
        }
        return () => actions.clearFixRecord();
    }, [dispatch, pid, recordToFix?.rek_pid]);
    // Update contentIndicators field's default value once the record is loaded.
    // This is required to properly render the field with already selected
    // content indicators as disabled options.
    useLayoutEffect(() => {
        resetField('contentIndicators', { defaultValue: contentIndicators });
    }, [resetField, contentIndicators]);
    // display successful submission dialog
    useEffect(() => {
        if (isSubmitSuccessful) confirmDialogBoxRef.current.showConfirmation();
    }, [isSubmitSuccessful]);

    // loading
    if (accountAuthorLoading || loadingRecordToFix) {
        return (
            <React.Fragment>
                <InlineLoader message={txt.loadingMessage} />
            </React.Fragment>
        );
    }
    // record not found
    if (!loadingRecordToFix && !recordToFix) {
        return <WorkNotFound />;
    }
    // if author is not linked to this record, abandon form
    if (recordToFix && !isAuthorLinked(author, recordToFix)) {
        navigate(-1);
        return <div />;
    }

    // navigation
    const navigateToMyResearch = () => {
        navigate(pathConfig.records.mine);
    };
    const navigateToDashboard = () => {
        navigate(pathConfig.dashboard);
    };
    const cancelFix = () => {
        navigateToMyResearch();
    };

    // dialog & alert
    const formLevelError = getFormLevelError({ publication, fixAction, ...data });
    const alertProps = validation.getErrorAlertProps({
        submitting: isSubmitting,
        submitSucceeded: isSubmitSuccessful,
        alertLocale: txtFixForm,
        ...getPropsForAlert(formLevelError),
    });

    const onSubmit = safelyHandleSubmit(async () => {
        const data = mergeWithFormValues({ author, publication });
        await dispatch(
            data.fixAction === RECORD_ACTION_UNCLAIM ? actions.unclaimRecord(data) : actions.fixRecord(data),
        );
    });

    return (
        <StandardPage title={txt.title}>
            <ConfirmDiscardFormChanges dirty={isDirty} isSubmitSuccessful={isSubmitSuccessful}>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <StandardCard title={txt.subTitle} help={txt.help}>
                                <PublicationCitation publication={recordToFix} citationStyle={'header'} />
                                <Field
                                    control={control}
                                    component={SelectField}
                                    disabled={isSubmitting}
                                    name="fixAction"
                                    label={txt.fieldLabels.action}
                                    validate={[validation.required]}
                                    required
                                    selectFieldId="fix-action"
                                    data-testid="fix-action"
                                >
                                    {fixOptions}
                                </Field>
                            </StandardCard>
                        </Grid>
                        {fixAction === RECORD_ACTION_FIX && (
                            <React.Fragment>
                                <NavigationDialogBox
                                    when={isDirty && !isSubmitSuccessful}
                                    txt={txtFixForm.cancelWorkflowConfirmation}
                                />
                                <ConfirmDialogBox
                                    onRef={createConfirmDialogBoxRefAssigner(confirmDialogBoxRef)}
                                    onAction={navigateToMyResearch}
                                    onCancelAction={navigateToDashboard}
                                    locale={saveConfirmationLocale}
                                />
                                <Grid xs={12}>
                                    <StandardCard title={txtFixForm.comments.title} help={txtFixForm.comments.help}>
                                        <Grid container spacing={2} padding={0}>
                                            <Grid xs={12}>
                                                <Field
                                                    control={control}
                                                    component={TextField}
                                                    disabled={isSubmitting}
                                                    name="comments"
                                                    textFieldId="comments"
                                                    type="text"
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    label={txtFixForm.comments.fieldLabels.comments}
                                                />
                                            </Grid>
                                            <Grid xs={12}>
                                                <Field
                                                    control={control}
                                                    component={TextField}
                                                    disabled={isSubmitting}
                                                    name="rek_link"
                                                    textFieldId="rek_link"
                                                    type="text"
                                                    fullWidth
                                                    label={txtFixForm.comments.fieldLabels.url}
                                                    validate={[validation.url]}
                                                />
                                            </Grid>
                                        </Grid>
                                    </StandardCard>
                                </Grid>
                                {showContentIndicatorsField(recordToFix) && (
                                    <Grid xs={12}>
                                        <StandardCard
                                            title={txtFixForm.contentIndicators.title}
                                            help={txtFixForm.contentIndicators.help}
                                        >
                                            <Grid container spacing={3} padding={0}>
                                                <Grid xs={12}>
                                                    <Typography>{txtFixForm.contentIndicators.description}</Typography>
                                                </Grid>
                                                <Grid xs={12}>
                                                    <Field
                                                        control={control}
                                                        component={ContentIndicatorsField}
                                                        displayType={recordToFix.rek_display_type}
                                                        disabled={isSubmitting}
                                                        id="content-indicators"
                                                        name="contentIndicators"
                                                        label={txtFixForm.contentIndicators.label}
                                                        multiple
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                        </StandardCard>
                                    </Grid>
                                )}
                                <Grid xs={12}>
                                    <StandardCard title={txtFixForm.fileUpload.title} help={txtFixForm.fileUpload.help}>
                                        {txtFixForm.fileUpload.description}
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
                            </React.Fragment>
                        )}
                        {fixAction === RECORD_ACTION_UNCLAIM && (
                            <Grid xs={12}>
                                <StandardCard title={txtUnclaimForm.title} help={txtUnclaimForm.help}>
                                    <Alert {...txtUnclaimForm.alert} />
                                    {txtUnclaimForm.description}
                                    <ConfirmDialogBox
                                        onRef={createConfirmDialogBoxRefAssigner(confirmDialogBoxRef)}
                                        onAction={navigateToMyResearch}
                                        onCancelAction={cancelFix}
                                        locale={txtUnclaimForm.successWorkflowConfirmation}
                                    />
                                </StandardCard>
                            </Grid>
                        )}

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
                                children={txt.cancel}
                                disabled={isSubmitting}
                                onClick={cancelFix}
                                color={'default'}
                            />
                        </Grid>
                        {fixAction && (
                            <Grid>
                                <Button
                                    type="submit"
                                    variant={'contained'}
                                    color={'primary'}
                                    fullWidth
                                    children={txt.submit}
                                    disabled={isSubmitting || !isEmptyObject(formLevelError) || hasValidationError}
                                    id="fixSubmit"
                                    data-testid="fix-submit"
                                    data-analyticsid="fixSubmit"
                                />
                            </Grid>
                        )}
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};

export default FixRecord;
