import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CommunitiesSelectField } from 'modules/SharedComponents/PublicationSubtype';
import { CollectionsSelectField } from 'modules/SharedComponents/PublicationSubtype';
import { DocumentTypeSingleField } from 'modules/SharedComponents/PublicationSubtype';
import { Alert } from '../../SharedComponents/Toolbox/Alert';

import { validation } from 'config';
import { default as componentLocale } from 'locale/components';
import { default as publicationLocale } from 'locale/publicationForm';

export const FORM_NAME = 'DigiTeamBatchImport';

export const DigiTeamBatchImport = (
    props = {
        docTypes: [],
    }
) => {
    const [communityPID, setCommunityPID] = useState(null); // props.formValues.toJS().communityPID
    const [collectionPID, setCollectionPID] = useState(null);
    const [docTypeID, setDocTypeID] = useState(null);

    useEffect(() => {
        console.log('communityPID = ', communityPID);
        console.log('collectionPID = ', collectionPID);
        console.log('docTypeID = ', docTypeID);
    });

    const _onCommunityChange = (event, selectedCommunityPid) => {
        if (selectedCommunityPid !== communityPID) {
            // community has changed - clear the collection
            setCommunityPID(selectedCommunityPid);

            // community has changed - clear the community
            setCollectionPID(null);
        }
    };

    const _onCollectionChanged = (event, selectedCollectionPid) => {
        setCollectionPID(selectedCollectionPid);
    };

    const _onDocTypeChange = (fieldProps, selectedDocType) => {
        // Update the state with new values
        setDocTypeID(selectedDocType);

        return (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange);
    };

    const batchImportTxt = componentLocale.components.digiTeam.batchImport;
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

    const _restartWorkflow = () => {
        // TODO
    };

    return (
        <StandardPage title={batchImportTxt.title}>
            <form>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Alert title={batchImportTxt.prompt.title}
                            message={batchImportTxt.prompt.message}
                            type={batchImportTxt.prompt.type} />
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
                                        onChange={_onCommunityChange}
                                    />
                                </Grid>
                                {props.formValues &&
                                    props.formValues.get('communityID') &&
                                    props.formValues.get('communityID').length > 0 && (
                                    <Grid item xs={12}>
                                        <Field
                                            component={CollectionsSelectField}
                                            name="collectionID"
                                            disabled={props.submitting}
                                            label={batchImportTxt.formLabels.collection.placeholder}
                                            required
                                            validate={[validation.required]}
                                            onChange={_onCollectionChanged}
                                            parentPid={props.formValues.get('communityID')}
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
                                        onChange={_onDocTypeChange}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>

                    {/* <p>directory will go here</p> */}

                    {alertProps && (
                        <Grid item xs={12}>
                            <Alert {...alertProps} />
                        </Grid>
                    )}

                    <Grid item xs={false} sm />
                    <Grid item xs={12} sm="auto">
                        <Button
                            variant="contained"
                            fullWidth
                            children={batchImportTxt.formLabels.cancelButtonLabel}
                            aria-label={batchImportTxt.formLabels.cancelButtonLabel}
                            disabled={props.submitting}
                            onClick={_restartWorkflow}
                        />
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Button
                            id="submit-data-collection"
                            variant="contained"
                            color="primary"
                            fullWidth
                            children={batchImportTxt.formLabels.submitButtonLabel}
                            aria-label={batchImportTxt.formLabels.submitButtonLabel}
                            onClick={props.handleSubmit}
                            disabled={props.submitting || props.disableSubmit}
                        />
                    </Grid>
                </Grid>
            </form>
        </StandardPage>
    );
};

DigiTeamBatchImport.propTypes = {
    submitting: PropTypes.bool,
    formValues: PropTypes.object,
    docTypes: PropTypes.array,
    isLoading: PropTypes.bool,
    actions: PropTypes.object,
    handleSubmit: PropTypes.func,
    disableSubmit: PropTypes.bool,
    loadItemsList: PropTypes.func,
};

export default DigiTeamBatchImport;
