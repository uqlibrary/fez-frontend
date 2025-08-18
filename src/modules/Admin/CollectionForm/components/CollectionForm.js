import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { useValidatedForm } from 'hooks';
import { useSelector, useDispatch } from 'react-redux';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { NewListEditorField, KeywordsForm } from 'modules/SharedComponents/Toolbox/ListEditor';
import { validation } from 'config';
import { default as formLocale } from 'locale/publicationForm';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { CommunitySelectField } from 'modules/SharedComponents/SelectFields';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { pathConfig } from 'config/pathConfig';
import CircularProgress from '@mui/material/CircularProgress';

import queryString from 'query-string';
import { getNotesSectionSearchKeys } from '../../../../actions/transformers';
import { createCollection } from '../../../../actions';

export const CollectionForm = ({ disableSubmit }) => {
    const newRecord = useSelector(state => state?.get('createCollectionReducer')?.newRecord || null);
    const currentAuthor = useSelector(state => state?.get('accountReducer')?.author || null);
    // form
    const {
        handleSubmit,
        watch,
        control,
        formState: { isSubmitting, isSubmitSuccessful, isDirty, errors },
    } = useValidatedForm({
        // use values instead of defaultValues, as the first triggers a re-render upon updates
        values: {
            fez_record_search_key_ismemberof: '',
            rek_title: '',
            rek_description: '',
            fez_record_search_key_keywords: '',
            internalNotes: null,
        },
    });

    const [apiError, setApiError] = React.useState('');
    const [selectedCommunity, setSelectedCommunity] = React.useState(false);
    const communityValue = watch('fez_record_search_key_ismemberof');
    useEffect(() => {
        if (communityValue) {
            // Add your custom logic here
            setSelectedCommunity(true);
        }
    }, [communityValue]);

    const dispatch = useDispatch();

    const onSubmit = values => {
        setApiError('');

        const data = { ...values, ...getNotesSectionSearchKeys(values) };

        delete data.internalNotes; // transformed above to fez_internal_notes: {ain_detail}

        const queryStringObject = queryString.parse(
            location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
            { ignoreQueryPrefix: true },
        );

        let parentPID = {};

        if (!!queryStringObject.pid) {
            parentPID = {
                fez_record_search_key_ismemberof: queryStringObject.pid,
            };
        }
        return dispatch(createCollection({ ...data, ...parentPID }, currentAuthor?.aut_id || null)).catch(error => {
            let err = error.message;
            const originalMessage = error?.original?.error?.message;
            err += originalMessage && ' ' + originalMessage;
            setApiError(err);
        });
    };

    const returnHome = () => {
        window.location.assign(pathConfig.index);
    };

    const reloadForm = () => {
        window.location.reload();
    };

    let hasParams = false;

    const queryStringObject = queryString.parse(
        location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
        { ignoreQueryPrefix: true },
    );
    if (queryStringObject?.pid && queryStringObject?.name) {
        hasParams = true;
    }
    const txt = formLocale.addACollection;
    const detailsTitle = !!hasParams ? `New collection in community '${queryStringObject.name}'` : txt.details.title;
    if (isSubmitSuccessful && newRecord && !!!apiError) {
        return (
            <StandardPage title={txt.title}>
                <Grid container spacing={3}>
                    <Grid xs={12}>
                        <StandardCard title={txt.afterSubmitTitle}>
                            <Typography>{txt.afterSubmitText}</Typography>
                        </StandardCard>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid xs />
                    <Grid>
                        <Button variant="contained" fullWidth onClick={reloadForm} data-testid="add-another-collection">
                            {txt.reloadFormButton}
                        </Button>
                    </Grid>
                    <Grid>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={returnHome}
                            data-testid="return-home"
                        >
                            {txt.afterSubmitButton}
                        </Button>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
    return (
        <StandardPage title={txt.title}>
            <ConfirmDiscardFormChanges dirty={isDirty} submitSucceeded={isSubmitSuccessful}>
                <form>
                    <NavigationDialogBox when={isDirty && !isSubmitSuccessful} txt={txt.cancelWorkflowConfirmation} />
                    <Grid container spacing={3} padding={0}>
                        {!!!hasParams && (
                            <Grid xs={12}>
                                <StandardCard title={txt.title} help={txt.help}>
                                    <Grid
                                        container
                                        spacing={3}
                                        padding={0}
                                        id="community-selector"
                                        data-testid="community-selector"
                                    >
                                        <Grid xs={12}>
                                            <Field
                                                control={control}
                                                component={CommunitySelectField}
                                                disabled={isSubmitting}
                                                genericSelectFieldId="rek-ismemberof"
                                                name="fez_record_search_key_ismemberof"
                                                required
                                                validate={[validation.required]}
                                                {...txt.formLabels.ismemberof}
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        )}
                        {(!!hasParams || selectedCommunity) && (
                            <Grid xs={12}>
                                <StandardCard title={detailsTitle} help={txt.details.help}>
                                    <Grid container spacing={3} padding={0}>
                                        <Grid xs={12}>
                                            <Field
                                                control={control}
                                                component={TextField}
                                                textFieldId="rek-title"
                                                disabled={isSubmitting}
                                                autoFocus
                                                name="rek_title"
                                                type="text"
                                                fullWidth
                                                {...txt.formLabels.title}
                                                required
                                                validate={[validation.required]}
                                            />
                                        </Grid>

                                        <Grid xs={12}>
                                            <Field
                                                control={control}
                                                component={TextField}
                                                textFieldId="rek-description"
                                                disabled={isSubmitting}
                                                name="rek_description"
                                                fullWidth
                                                multiline
                                                rows={5}
                                                {...txt.formLabels.description}
                                                validate={[validation.required]}
                                                required
                                            />
                                        </Grid>

                                        <Grid xs={12}>
                                            <Typography>{txt.formLabels.keywords.description}</Typography>
                                            <Field
                                                control={control}
                                                component={NewListEditorField}
                                                name="fez_record_search_key_keywords"
                                                maxCount={10}
                                                // validate={[validation.requiredList]}
                                                searchKey={{
                                                    value: 'rek_keywords',
                                                    order: 'rek_keywords_order',
                                                }}
                                                ListEditorForm={KeywordsForm}
                                                // isValid={validation.isValidKeyword(111)}
                                                listEditorId="rek-keywords"
                                                locale={txt.formLabels.keywords.field}
                                                disabled={isSubmitting}
                                            />
                                        </Grid>

                                        <Grid xs={12}>
                                            <Typography>{txt.formLabels.internalNotes.label}</Typography>
                                            <Field
                                                control={control}
                                                component={RichEditorField}
                                                richEditorId="internalNotes"
                                                disabled={isSubmitting}
                                                name="internalNotes"
                                                fullWidth
                                                multiline
                                                rows={5}
                                                {...txt.formLabels.internalNotes}
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        )}
                        {!!apiError && (
                            <Grid xs={12}>
                                <Alert alertId="api_error_alert" type="error_outline" message={apiError} />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={2} padding={0}>
                        <Grid xs={false} sm />
                        <Grid xs={12} sm="auto">
                            <Button
                                data-analyticsid="cancel-collection"
                                data-testid="cancel-collection"
                                variant="contained"
                                fullWidth
                                disabled={isSubmitting}
                                onClick={returnHome}
                                color={'default'}
                            >
                                {txt.cancel}
                            </Button>
                        </Grid>
                        <Grid xs={12} sm="auto">
                            <Button
                                data-analyticsid="submit-collection"
                                data-testid="submit-collection"
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting || disableSubmit || JSON.stringify(errors) !== '{}'}
                            >
                                {isSubmitting ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={25}
                                        id="add-collection-progress-bar"
                                        data-testid="add-collection-progress-bar"
                                    />
                                ) : (
                                    txt.submit
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};
CollectionForm.propTypes = {
    account: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    fileAccessId: PropTypes.number,
    actions: PropTypes.object,
    isSessionValid: PropTypes.bool,
    formErrors: PropTypes.object,

    newCollectionSaving: PropTypes.bool,
    newCollectionError: PropTypes.bool,

    submitSucceeded: PropTypes.bool,
    dirty: PropTypes.bool,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
};

export default CollectionForm;
