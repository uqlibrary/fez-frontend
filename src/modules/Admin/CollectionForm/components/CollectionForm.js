import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';
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

export default class CollectionForm extends Component {
    static propTypes = {
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

    constructor(props) {
        super(props);
    }

    cancelSubmit = () => {
        window.location.assign(pathConfig.index);
    };

    afterSubmit = () => {
        window.location.assign(pathConfig.index);
    };

    reloadForm = () => {
        window.location.reload();
    };

    render() {
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
        const detailsTitle = !!hasParams
            ? `New collection in community '${queryStringObject.name}'`
            : txt.details.title;
        if (this.props.submitSucceeded && this.props.newRecord) {
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
                            <Button variant="contained" fullWidth onClick={this.reloadForm}>
                                {txt.reloadFormButton}
                            </Button>
                        </Grid>
                        <Grid>
                            <Button variant="contained" color="primary" fullWidth onClick={this.afterSubmit}>
                                {txt.afterSubmitButton}
                            </Button>
                        </Grid>
                    </Grid>
                </StandardPage>
            );
        }
        // customise error for thesis submission
        const alertProps = validation.getErrorAlertProps({
            ...this.props,
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
                    dirty={this.props.dirty && (!!!hasParams || (!!hasParams && this.props.formValues.size > 1))}
                    submitSucceeded={this.props.submitSucceeded}
                >
                    <form>
                        <NavigationDialogBox
                            when={
                                this.props.dirty &&
                                !this.props.submitSucceeded &&
                                (!!!hasParams || (!!hasParams && this.props.formValues.size > 1))
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
                                                    disabled={this.props.submitting}
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
                                (this.props.formValues.get('fez_record_search_key_ismemberof') &&
                                    this.props.formValues.get('fez_record_search_key_ismemberof').length > 0)) && (
                                <Grid xs={12}>
                                    <StandardCard title={detailsTitle} help={txt.details.help}>
                                        <Grid container spacing={3} padding={0}>
                                            <Grid xs={12}>
                                                <Field
                                                    component={TextField}
                                                    textFieldId="rek-title"
                                                    disabled={this.props.submitting}
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
                                                    disabled={this.props.submitting}
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
                                                    disabled={this.props.submitting}
                                                />
                                            </Grid>

                                            <Grid xs={12}>
                                                <Typography>{txt.formLabels.internalNotes.label}</Typography>
                                                <Field
                                                    component={RichEditorField}
                                                    richEditorId="internalNotes"
                                                    disabled={this.props.submitting}
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
                                    disabled={this.props.submitting}
                                    onClick={this.cancelSubmit}
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
                                    onClick={this.props.handleSubmit}
                                    disabled={this.props.submitting || this.props.disableSubmit}
                                >
                                    {txt.submit}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </StandardPage>
        );
    }
}
