import React from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';
// import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

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

import queryString from 'query-string';

export const CollectionForm = ({ disableSubmit, formValues, newRecord, ...props }) => {
    const cancelSubmit = () => {
        window.location.assign(pathConfig.index);
    };

    const afterSubmit = () => {
        window.location.assign(pathConfig.index);
    };

    const reloadForm = () => {
        window.location.reload();
    };

    let hasParams = false;

    const queryStringObject = queryString.parse(
        /* istanbul ignore next */
        location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
        { ignoreQueryPrefix: true },
    );
    if (queryStringObject?.pid && queryStringObject?.name) {
        hasParams = true;
    }
    const txt = formLocale.addACollection;
    const detailsTitle = !!hasParams ? `New collection in community '${queryStringObject.name}'` : txt.details.title;
    if (props.submitSucceeded && newRecord) {
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
                        <Button variant="contained" fullWidth onClick={reloadForm}>
                            {txt.reloadFormButton}
                        </Button>
                    </Grid>
                    <Grid>
                        <Button variant="contained" color="primary" fullWidth onClick={afterSubmit}>
                            {txt.afterSubmitButton}
                        </Button>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }
    // customise error for thesis submission
    const alertProps = validation.getErrorAlertProps({
        ...props,
        alertLocale: {
            validationAlert: { ...formLocale.validationAlert },
            progressAlert: { ...formLocale.progressAlert },
            successAlert: { ...formLocale.successAlert },
            errorAlert: {
                ...formLocale.errorAlert,
                message: formLocale.addACollection.addFailedMessage,
            },
        },
    });
    return (
        <StandardPage title={txt.title}>
            <ConfirmDiscardFormChanges
                dirty={props.dirty && (!!!hasParams || (!!hasParams && formValues.size > 1))}
                submitSucceeded={props.submitSucceeded}
            >
                <form>
                    <NavigationDialogBox
                        when={
                            props.dirty &&
                            !props.submitSucceeded &&
                            (!!!hasParams || (!!hasParams && formValues.size > 1))
                        }
                        txt={txt.cancelWorkflowConfirmation}
                    />
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
                                                component={CommunitySelectField}
                                                disabled={props.submitting}
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
                        {(!!hasParams ||
                            (formValues.get('fez_record_search_key_ismemberof') &&
                                formValues.get('fez_record_search_key_ismemberof').length > 0)) && (
                            <Grid xs={12}>
                                <StandardCard title={detailsTitle} help={txt.details.help}>
                                    <Grid container spacing={3} padding={0}>
                                        <Grid xs={12}>
                                            <Field
                                                component={TextField}
                                                textFieldId="rek-title"
                                                disabled={props.submitting}
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
                                                component={TextField}
                                                textFieldId="rek-description"
                                                disabled={props.submitting}
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
                                                disabled={props.submitting}
                                            />
                                        </Grid>

                                        <Grid xs={12}>
                                            <Typography>{txt.formLabels.internalNotes.label}</Typography>
                                            <Field
                                                component={RichEditorField}
                                                richEditorId="internalNotes"
                                                disabled={props.submitting}
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
                        {alertProps && (
                            <Grid xs={12}>
                                <Alert {...alertProps} />
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
                                disabled={props.submitting}
                                onClick={cancelSubmit}
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
                                onClick={props.handleSubmit}
                                disabled={props.submitting || disableSubmit}
                            >
                                {txt.submit}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};
CollectionForm.propTypes = {
    ...propTypes, // all redux-form props
    author: PropTypes.object,
    account: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    fileAccessId: PropTypes.number,
    actions: PropTypes.object,
    isSessionValid: PropTypes.bool,
    formValues: PropTypes.object,
    formErrors: PropTypes.object,

    newCollectionSaving: PropTypes.bool,
    newCollectionError: PropTypes.bool,
    newRecord: PropTypes.object,
};
// console.log('CollectionForm.propTypes=', JSON.stringify(CollectionForm.propTypes));
export default CollectionForm;
