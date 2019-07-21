import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CommunitiesSelectField } from 'modules/SharedComponents/PublicationSubtype';
import { CollectionsSelectField } from 'modules/SharedComponents/PublicationSubtype';
import { DocumentTypeSelectField } from 'modules/SharedComponents/PublicationSubtype';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import DirectorySelectField from '../containers/DirectorySelectField';

import { validation } from 'config';
import { default as componentsLocale } from 'locale/components';
import { default as publicationLocale } from 'locale/publicationForm';

export const FORM_NAME = 'DigiTeamBatchImport';

export const DigiTeamBatchImport = props => {
    const communityID = props.formValues && props.formValues.toJS && props.formValues.toJS().communityID;

    const _onDocTypeChange = fieldProps => {
        return (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange);
    };

    const batchImportTxt = componentsLocale.components.digiTeam.batchImport;
    const addACollectionTxt = publicationLocale.addACollection;

    const alertProps = validation.getErrorAlertProps({
        ...props,
        alertLocale: {
            validationAlert: { ...publicationLocale.validationAlert },
            progressAlert: { ...publicationLocale.progressAlert },
            successAlert: { ...publicationLocale.successAlert },
            errorAlert: { ...publicationLocale.errorAlert },
        },
    });

    // const _restartWorkflow = () => {
    //     // TODO
    // };

    return (
        <StandardPage title={batchImportTxt.title}>
            <form>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Alert
                            title={batchImportTxt.prompt.title}
                            message={batchImportTxt.prompt.message}
                            type={batchImportTxt.prompt.type}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StandardCard
                            title={batchImportTxt.formLabels.collection.label}
                            help={batchImportTxt.formLabels.collection.help}
                        >
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <Field
                                        component={CommunitiesSelectField}
                                        disabled={props.submitting}
                                        name="communityID"
                                        label={addACollectionTxt.formLabels.ismemberof.placeholder}
                                        required
                                        validate={[validation.required]}
                                        // onChange={_onCommunityChange}
                                    />
                                </Grid>
                                {communityID && (
                                    <Grid item xs={12}>
                                        <Field
                                            component={CollectionsSelectField}
                                            disabled={props.submitting}
                                            label={batchImportTxt.formLabels.collection.placeholder}
                                            name="collectionID"
                                            required
                                            title={batchImportTxt.formLabels.collection.title}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </StandardCard>
                    </Grid>

                    <Grid item xs={12}>
                        <StandardCard
                            title={batchImportTxt.formLabels.docType.label}
                            help={batchImportTxt.details.docType.help}
                        >
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <Field
                                        component={DocumentTypeSelectField}
                                        name="documentType"
                                        disabled={props.submitting}
                                        label={batchImportTxt.formLabels.docType.placeholder}
                                        required
                                        validate={[validation.required]}
                                        onChange={_onDocTypeChange}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>

                    <Grid item xs={12}>
                        <StandardCard title={batchImportTxt.formLabels.directory.label}>
                            <Grid container spacing={24}>
                                <Grid item xs={12}>
                                    <Field
                                        component={DirectorySelectField}
                                        disabled={props.submitting}
                                        name="san-dir"
                                        required
                                        // onChange={_onDirectoryChange}
                                        {...batchImportTxt.formLabels.directory}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>

                    {alertProps && (
                        <Grid item xs={12}>
                            <Alert {...alertProps} />
                        </Grid>
                    )}

                    <Grid item xs={false} sm />
                    <Grid item xs={12} sm="auto">
                        <Button
                            aria-label={batchImportTxt.formLabels.cancelButtonLabel}
                            children={batchImportTxt.formLabels.cancelButtonLabel}
                            disabled={props.submitting}
                            fullWidth
                            // onClick={_restartWorkflow}
                            variant="contained"
                        />
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Button
                            aria-label={batchImportTxt.formLabels.submitButtonLabel}
                            children={batchImportTxt.formLabels.submitButtonLabel}
                            color="primary"
                            disabled={props.submitting || props.disableSubmit}
                            fullWidth
                            id="submit-data-collection"
                            onClick={props.handleSubmit}
                            variant="contained"
                        />
                    </Grid>
                </Grid>
            </form>
        </StandardPage>
    );
};

DigiTeamBatchImport.propTypes = {
    actions: PropTypes.object,
    collectionList: PropTypes.array,
    communityCollectionsLoading: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    docTypes: PropTypes.array,
    formValues: PropTypes.object,
    handleSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
    loadItemsList: PropTypes.func,
    submitting: PropTypes.bool,
};

DigiTeamBatchImport.defaultProps = {
    collectionList: [],
    docTypes: [],
    formValues: {},
};

export default DigiTeamBatchImport;
