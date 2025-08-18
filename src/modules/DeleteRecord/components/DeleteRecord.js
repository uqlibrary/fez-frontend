import React, { useEffect, useRef } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { default as pagesLocale } from 'locale/pages';
import { default as formsLocale } from 'locale/forms';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { pathConfig, validation } from 'config';
import {
    DELETED,
    DOI_CROSSREF_PREFIX,
    DOI_DATACITE_PREFIX,
    PUBLICATION_EXCLUDE_CITATION_TEXT_LIST,
} from 'config/general';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { doesListContainItem } from 'helpers/general';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import WorkNotFound from 'modules/NotFound/components/WorkNotFound';
import * as actions from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Field } from '../../SharedComponents/Toolbox/ReactHookForm';
import { useForm } from '../../../hooks';
import { createConfirmDialogBoxRefAssigner } from '../../SharedComponents/Toolbox/ConfirmDialogBox/components/ConfirmDialogBox';

const DeleteRecord = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // constants
    const txt = pagesLocale.pages.deleteRecord;
    const formTxt = formsLocale.forms.deleteRecordForm;
    // route params
    const { pid } = useParams();
    // app's global state
    const { accountAuthorLoading } = useSelector(state => state.get('accountReducer'));
    const { recordToDelete, loadingRecordToDelete } = useSelector(state => state.get('deleteRecordReducer'));
    // to allow confirmDialogBox control
    const confirmDialogBoxRef = useRef();

    const {
        control,
        safelyHandleSubmit,
        mergeWithFormValues,
        formState: { hasValidationError, isDirt, isSubmitting, isSubmitSuccessful, serverError },
    } = useForm();

    const onSubmit = safelyHandleSubmit(async () => {
        const payload = mergeWithFormValues({ publication: { ...recordToDelete } });
        // unfortunately, RTL doesn't render the editor as the browser does
        /* istanbul ignore next */
        if (payload.publication?.fez_record_search_key_deletion_notes?.rek_deletion_notes?.htmlText) {
            payload.publication.fez_record_search_key_deletion_notes.rek_deletion_notes =
                payload.publication?.fez_record_search_key_deletion_notes?.rek_deletion_notes?.htmlText;
        }

        await dispatch(
            payload.publication.rek_status === DELETED
                ? actions.deleteUpdatePartial({ ...payload })
                : actions.deleteRecord({ ...payload }),
        );
    });

    const navigateToSearchPage = () => {
        navigate(pathConfig.records.search);
    };

    const navigateToViewPage = () => {
        navigate(pathConfig.records.view(pid));
    };

    const getCustomAlertMessage = (key, statusCode) => {
        const errorObject = formsLocale.forms.deleteRecordForm.errorCustom[key]?.find(customError => {
            return customError.httpStatus === statusCode;
        });
        /* istanbul ignore next */
        return errorObject ? errorObject.message : formsLocale.forms.deleteRecordForm.errorAlert.message;
    };

    const getErrorAlertProps = (rekType, serverError) => {
        const defaultProps = {
            submitting: isSubmitting,
            submitSucceeded: isSubmitSuccessful,
            alertLocale: formsLocale.forms.deleteRecordForm,
            error: serverError?.message,
        };

        if (rekType !== 'Collection' && rekType !== 'Community') return defaultProps;
        if (serverError?.status !== 409) return defaultProps;

        const errorMessage = getCustomAlertMessage('communityCollection', serverError.status);
        return {
            ...defaultProps,
            error: rekType,
            alertLocale: {
                errorAlert: {
                    ...formsLocale.forms.deleteRecordForm.errorAlert,
                    message: errorMessage,
                },
            },
        };
    };

    useEffect(() => {
        if (actions && pid && !recordToDelete?.rek_pid) {
            dispatch(actions.loadRecordToDelete(pid));
        }

        return () => {
            // clear previously selected record for deletion
            dispatch(actions.clearDeleteRecord());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, pid]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            confirmDialogBoxRef.current?.showConfirmation?.();
        }
    }, [confirmDialogBoxRef, isSubmitSuccessful]);

    if (!loadingRecordToDelete && !recordToDelete) {
        return <WorkNotFound />;
    }

    if (accountAuthorLoading || loadingRecordToDelete) {
        return (
            <React.Fragment>
                <InlineLoader message={txt.loadingMessage} />
            </React.Fragment>
        );
    }

    const isDeleted = recordToDelete?.rek_status === DELETED;
    const hasCrossrefDoi = recordToDelete?.fez_record_search_key_doi?.rek_doi?.startsWith(DOI_CROSSREF_PREFIX);
    const hasDataCiteDoi = recordToDelete?.fez_record_search_key_doi?.rek_doi?.startsWith(DOI_DATACITE_PREFIX);

    const saveConfirmationLocale = { ...formTxt.successWorkflowConfirmation };
    const errorAlertProps = getErrorAlertProps(recordToDelete?.rek_display_type_lookup, serverError);
    const alertProps = validation.getErrorAlertProps({ ...errorAlertProps });
    const hideCitationText = doesListContainItem(
        PUBLICATION_EXCLUDE_CITATION_TEXT_LIST,
        recordToDelete?.rek_display_type_lookup?.toLowerCase(),
    );

    return (
        <StandardPage title={txt.title(isDeleted)}>
            <ConfirmDiscardFormChanges dirty={isDirt} isSubmitSuccessful={isSubmitSuccessful}>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.subTitle(isDeleted)} help={txt.help}>
                                <PublicationCitation
                                    publication={recordToDelete}
                                    citationStyle={'header'}
                                    hideCitationText={hideCitationText}
                                />
                            </StandardCard>
                        </Grid>
                        <ConfirmDialogBox
                            onRef={createConfirmDialogBoxRefAssigner(confirmDialogBoxRef)}
                            onAction={navigateToViewPage}
                            onCancelAction={navigateToSearchPage}
                            locale={saveConfirmationLocale}
                        />
                        <Grid item xs={12}>
                            <StandardCard title={formTxt.reason.title(isDeleted)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            control={control}
                                            component={TextField}
                                            textFieldId="reason"
                                            disabled={isSubmitting}
                                            name="reason"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label={formTxt.reason.label(isDeleted)}
                                            validate={[validation.spacelessMaxLength255Validator]}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {hasCrossrefDoi && (
                            <Grid item xs={12}>
                                <StandardCard title={formTxt.doiResolutionUrl.title}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Field
                                                control={control}
                                                component={TextField}
                                                disabled={isSubmitting}
                                                name="publication.fez_record_search_key_doi_resolution_url.rek_doi_resolution_url"
                                                textFieldId="rek-doi-resolution-url"
                                                type="text"
                                                fullWidth
                                                validate={[validation.url, validation.spacelessMaxLength255Validator]}
                                                label={formTxt.doiResolutionUrl.label}
                                                placeholder={formTxt.doiResolutionUrl.placeholder}
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        )}
                        {hasDataCiteDoi && (
                            <>
                                <Grid item xs={12}>
                                    <StandardCard title={formTxt.newDoi.title}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Field
                                                    control={control}
                                                    component={TextField}
                                                    disabled={isSubmitting}
                                                    name="publication.fez_record_search_key_new_doi.rek_new_doi"
                                                    textFieldId="rek-new-doi"
                                                    type="text"
                                                    fullWidth
                                                    validate={[
                                                        validation.doi,
                                                        validation.spacelessMaxLength255Validator,
                                                    ]}
                                                    label={formTxt.newDoi.label}
                                                    placeholder={formTxt.newDoi.placeholder}
                                                />
                                            </Grid>
                                        </Grid>
                                    </StandardCard>
                                </Grid>
                                <Grid item xs={12}>
                                    <StandardCard title={formTxt.notes.title}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Field
                                                    control={control}
                                                    component={RichEditorField}
                                                    name="publication.fez_record_search_key_deletion_notes.rek_deletion_notes"
                                                    textFieldId="rek-deletion-notes-text"
                                                    richEditorId="rek-deletion-notes"
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    validate={[validation.maxListEditorTextLength2000]}
                                                    maxValue={2000}
                                                />
                                            </Grid>
                                        </Grid>
                                    </StandardCard>
                                </Grid>
                            </>
                        )}
                        {alertProps && (
                            <Grid item xs={12}>
                                <Alert pushToTop {...alertProps} />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={3} style={{ marginTop: 8 }}>
                        <Grid item xs />
                        <Grid item>
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={txt.cancel}
                                disabled={isSubmitting}
                                onClick={navigateToViewPage}
                                id="cancel-delete-record"
                                data-testid="cancel-delete-record"
                                data-analyticsid="cancel-delete-record"
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                children={txt.submit(isDeleted)}
                                disabled={isSubmitting || hasValidationError}
                                id="submit-delete-record"
                                data-analyticsid="delete-admin"
                                data-testid="submit-delete-record"
                            />
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};

export default DeleteRecord;
