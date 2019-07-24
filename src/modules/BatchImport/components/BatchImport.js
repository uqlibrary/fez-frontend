import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import {
    CommunitiesSelectField,
    CollectionsSelectField,
    DocumentTypeSingleField,
} from 'modules/SharedComponents/PublicationSubtype';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import DirectorySelectField from '../containers/DirectorySelectField';

import { validation } from 'config';
import { pathConfig } from 'config/routes';
import { default as componentsLocale } from 'locale/components';
import { default as publicationLocale } from 'locale/publicationForm';

export const FORM_NAME = 'BatchImport';

export const BatchImport = props => {
    const batchImportTxt = componentsLocale.components.digiTeam.batchImport;
    const addACollectionTxt = publicationLocale.addACollection;

    const alertProps = validation.getErrorAlertProps({
        ...props,
        alertLocale: {
            validationAlert: { ...publicationLocale.validationAlert },
            progressAlert: { ...publicationLocale.progressAlert },
            successAlert: { ...batchImportTxt.submitSuccessAlert },
            errorAlert: { ...batchImportTxt.submitFailureAlert },
        },
    });

    const _abandonImport = () => {
        props.history.push(pathConfig.index);
    };

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
                                    />
                                </Grid>
                                {props.communityID && (
                                    <Grid item xs={12}>
                                        <Field
                                            component={CollectionsSelectField}
                                            disabled={props.submitting}
                                            label={batchImportTxt.formLabels.collection.placeholder}
                                            name="collectionID"
                                            parentPid={props.communityID}
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
                                        component={DocumentTypeSingleField}
                                        name="documentType"
                                        disabled={props.submitting}
                                        label={batchImportTxt.formLabels.docType.placeholder}
                                        required
                                        validate={[validation.required]}
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
                                        name="importDirectory"
                                        required
                                        validate={[validation.required]}
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
                            onClick={_abandonImport}
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

BatchImport.propTypes = {
    communityID: PropTypes.string,
    disableSubmit: PropTypes.bool,
    handleSubmit: PropTypes.func,
    history: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
};

export default React.memo(BatchImport);
