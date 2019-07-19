import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CommunitiesSelectField } from 'modules/SharedComponents/PublicationSubtype';
import { CollectionsSelectField } from 'modules/SharedComponents/PublicationSubtype';
import DocumentTypeField from 'modules/SharedComponents/SearchComponent/components/Fields/DocumentTypeField';
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

    const _onCommunityChange = (event, newCommunityPid) => {
        if (newCommunityPid !== communityPID) {
            // community has changed - clear the collection
            setCommunityPID(newCommunityPid);
            // community has changed - clear the community
            setCollectionPID(null);
        }
    };

    const _onCollectionChanged = (event, collectionPid) => {
        setCollectionPID(collectionPid);
    };

    const _onDocTypeChange = (fieldProps) => {
        // Update the state with new values
        setDocTypeID(fieldProps);

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
                                    <DocumentTypeField
                                        name="doctype"
                                        docTypes={props.docTypes}
                                        updateDocTypeValues={_onDocTypeChange}
                                        disabled={props.isLoading}
                                        disableMultiple
                                        locale={batchImportTxt.formLabels.docType}
                                        required
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
