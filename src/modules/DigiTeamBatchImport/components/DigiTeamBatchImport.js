import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { CommunitiesSelectField } from 'modules/SharedComponents/PublicationSubtype';
// import { CollectionsSelectField } from 'modules/SharedComponents/PublicationSubtype';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import DocumentTypeField from 'modules/SharedComponents/SearchComponent/components/Fields/DocumentTypeField';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import DirectorySelectField from '../containers/DirectorySelectField';

import { validation } from 'config';
import { default as componentsLocale } from 'locale/components';
import { default as publicationForm } from 'locale/publicationForm';

export const DigiTeamBatchImport = (
    props = {
        docTypes: [],
        formValues: {},
        collectionList: [],
    }
) => {
    const [communityID, setCommunityID] = useState(props.formValues.toJS().communityID);
    const [collectionsList, setCollectionsList] = useState(
        props.collectionList.map((item, index) => {
            return { text: item.rek_title, value: item.rek_pid, index };
        })
    );

    const _onCommunityChange = (event, newCommunityPid) => {
        if (newCommunityPid !== communityID) {
            setCommunityID(newCommunityPid);
            setCollectionsList([]); // community has changed - clear the collection

            // load collection list
            props.actions &&
                props.actions.getCollectionsInCommunity &&
                props.actions.getCollectionsInCommunity(newCommunityPid);
        }
    };

    const batchImportTxt = componentsLocale.components.digiTeam.batchImport;
    // const publicationTypeTxt = componentLocale.publicationType;
    const AddACollectionTxt = publicationForm.addACollection; // check this is right...

    const alertProps = validation.getErrorAlertProps({
        ...props,
        alertLocale: {
            validationAlert: { ...publicationForm.validationAlert },
            progressAlert: { ...publicationForm.progressAlert },
            successAlert: { ...publicationForm.successAlert },
            errorAlert: { ...publicationForm.errorAlert },
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
                            title={batchImportTxt.formLabels.community.label}
                            help={batchImportTxt.details.community.help}
                        >
                            <Grid container spacing={16}>
                                <Grid item xs={12}>
                                    <Field
                                        component={CommunitiesSelectField}
                                        disabled={props.submitting}
                                        name="communityID"
                                        locale={AddACollectionTxt.formLabels.ismemberof}
                                        required
                                        validate={[validation.required]}
                                        onChange={_onCommunityChange}
                                    />
                                </Grid>
                                {communityID && (
                                    <Grid item xs={12}>
                                        <Field
                                            component={GenericSelectField}
                                            disabled={props.submitting}
                                            name="collectionID"
                                            required
                                            validate={[validation.required]}
                                            itemsList={collectionsList}
                                            itemsLoading={props.communityCollectionsLoading}
                                            {...batchImportTxt.formLabels.collection}
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
                                        name="docTypeID"
                                        docTypes={props.docTypes}
                                        // updateDocTypeValues={setDocTypeID}
                                        disabled={props.isLoading}
                                        disableMultiple
                                        locale={batchImportTxt.formLabels.docType}
                                        required
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
    collectionList: PropTypes.array,
    communityCollectionsLoading: PropTypes.bool,
};

export default DigiTeamBatchImport;
