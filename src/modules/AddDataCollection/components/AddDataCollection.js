import React from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';
import { parseHtmlToJSX } from 'helpers/general';
import moment from 'moment';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { FieldOfResearchListField } from 'modules/SharedComponents/LookupFields';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { NewListEditorField, KeywordsForm } from 'modules/SharedComponents/Toolbox/ListEditor';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { GeoCoordinatesField } from 'modules/SharedComponents/Toolbox/GeoCoordinatesField';
import { AuthorIdField } from 'modules/SharedComponents/LookupFields';
import { RelatedDatasetAndPublicationListField } from 'modules/SharedComponents/LookupFields';
import { default as Divider } from 'modules/SharedComponents/Toolbox/Divider';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import DepositAgreementField from './DepositAgreementField';

import { pathConfig, validation, DATASET_ACCESS_CONDITIONS_OPTIONS } from 'config';
import { CURRENT_LICENCES } from 'config/general';
import componentLocale from 'locale/components';
import { default as formLocale } from 'locale/publicationForm';
import { locale } from 'locale';
import { selectFields } from 'locale/selectFields';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { useNavigate } from 'react-router-dom';

/*
 * given an array of licenses containing a heading and an array of description lines,
 * construct the html to display the licences
 */
export const licenseText = licenses => {
    // export for test coverage
    return (licenses || [])
        .map(license => {
            const flattenedDescripton = (license.description || [])
                .map(description => {
                    return `<p>${description}</p>`;
                })
                .join('');
            const licenseTitle = (!!license.text && `<h5>${license.text}</h5>`) || '';
            return licenseTitle.concat(flattenedDescripton);
        })
        .join('');
};

const usePrevious = value => {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

export const AddDataCollection = ({ author, disableSubmit, actions, isSessionValid, resetForm, ...props }) => {
    const navigate = useNavigate();
    const previous = usePrevious(props.submitSucceeded);
    const confirmationBoxRef = React.useRef();

    React.useEffect(() => {
        if (previous !== undefined && previous !== props.submitSucceeded) {
            confirmationBoxRef.current.showConfirmation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.submitSucceeded]);

    const setConfirmationRef = React.useCallback(node => {
        confirmationBoxRef.current = node; // TODO: Add check that this worked
    }, []);

    const _navigateToMyDatasets = () => {
        resetForm();
        actions.clearNewRecord();
        navigate(pathConfig.dataset.mine);
    };

    const _restartWorkflow = () => {
        resetForm();
        window.location.reload();
    };

    const txt = formLocale.addDataset;
    const txtFoR = componentLocale.components.fieldOfResearchForm;
    const formValues = props.formValues && props.formValues.toJS();
    const startDate =
        formValues &&
        formValues.fez_record_search_key_start_date &&
        formValues.fez_record_search_key_start_date.rek_start_date;
    const endDate =
        formValues &&
        formValues.fez_record_search_key_end_date &&
        formValues.fez_record_search_key_end_date.rek_end_date;
    const dateError =
        !!startDate && !!endDate && moment(startDate).format() > moment(endDate).format()
            ? txt.information.optionalDatasetDetails.fieldLabels.collectionStart.rangeError
            : '';

    // customise error for data collection submission
    const alertProps = validation.getErrorAlertProps({
        ...props,
        author,
        isSessionValid,
        dirty: true,
        alertLocale: {
            validationAlert: { ...formLocale.validationAlert },
            progressAlert: { ...formLocale.progressAlert },
            successAlert: { ...formLocale.successAlert },
            errorAlert: { ...formLocale.errorAlert },
        },
    });

    const saveConfirmationLocale = { ...locale.pages.addDataset.successWorkflowConfirmation };
    saveConfirmationLocale.confirmationMessage = (
        <Grid container spacing={3}>
            <Grid xs={12}>
                {props.newRecordFileUploadingOrIssueError && (
                    <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />
                )}
                {saveConfirmationLocale.recordSuccessConfirmationMessage}
            </Grid>
        </Grid>
    );
    const getLicenceHelp = template => {
        // text is here as only way to combine with centralised CURRENT_LICENCES. No user-supplied data used
        template.text = (
            <div>
                <h3>Access conditions</h3>
                <ul>
                    <li>Open Access (upload your data, or link to the data)</li>
                    <li>Meditated Access</li>
                </ul>
                <h3>Licence</h3>
                <h4>UQ General Usage Terms and Conditions for data publishing in eSpace</h4>
                <p>
                    University of Queensland provides standard licence agreements for researchers publishing their
                    datasets in eSpace. The license agreements ensure that downloads and reuse of your data will be
                    properly acknowledged.
                </p>
                <h4>Current types of licences</h4>
                {parseHtmlToJSX(licenseText(CURRENT_LICENCES))}
                <p>
                    View more on{' '}
                    <a href="http://guides.library.uq.edu.au/deposit_your_data/terms_and_conditions" target="_blank">
                        UQ Terms & Conditions
                    </a>
                </p>
            </div>
        );
        return template;
    };

    return (
        <StandardPage title={txt.pageTitle}>
            <ConfirmDiscardFormChanges dirty={props.dirty} submitSucceeded={props.submitSucceeded}>
                <form>
                    <ConfirmDialogBox
                        onRef={setConfirmationRef}
                        onAction={_navigateToMyDatasets}
                        onCancelAction={_restartWorkflow}
                        locale={saveConfirmationLocale}
                    />
                    <NavigationDialogBox
                        when={props.dirty && !props.submitSucceeded}
                        txt={txt.cancelWorkflowConfirmation}
                    />
                    <Grid container spacing={3} className={'DataCollection'}>
                        <Grid xs={12}>
                            <StandardCard title={txt.information.agreement.title}>
                                <Grid container spacing={3} padding={0}>
                                    <Grid xs={12}>
                                        <Field
                                            component={DepositAgreementField}
                                            depositAgreement={txt.information.agreement.text}
                                            name="rek_copyright"
                                            required
                                            validate={[validation.requireChecked]}
                                            disabled={props.submitting}
                                            depositAgreementFieldId="rek-copyright"
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txt.information.dataset.title}>
                                <Grid container spacing={3} padding={0}>
                                    <Grid xs={12} sm={12}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
                                            textFieldId="rek-title"
                                            name="rek_title"
                                            required
                                            fullWidth
                                            multiline
                                            rows={1}
                                            {...txt.information.dataset.fieldLabels.datasetTitle}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={12}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
                                            name="rek_description"
                                            textFieldId="rek-description"
                                            required
                                            fullWidth
                                            multiline
                                            rows={1}
                                            {...txt.information.dataset.fieldLabels.description}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
                                            name="contact.contactName"
                                            textFieldId="rek-contributor"
                                            required
                                            fullWidth
                                            {...txt.information.dataset.fieldLabels.contactName}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Field
                                            id="contact-name-id-auto-complete"
                                            component={AuthorIdField}
                                            disabled={props.submitting}
                                            name="contact.contactNameId"
                                            fullWidth
                                            required
                                            {...txt.information.dataset.fieldLabels.contactId}
                                            validate={[validation.required]}
                                            authorIdFieldId="rek-contributor-id"
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={12}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
                                            name="contact.contactEmail"
                                            textFieldId="rek-contact-details-email"
                                            required
                                            fullWidth
                                            {...txt.information.dataset.fieldLabels.contactEmail}
                                            validate={[validation.required, validation.email]}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={12}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
                                            name="fez_record_search_key_doi.rek_doi"
                                            textFieldId="rek-doi"
                                            type="text"
                                            fullWidth
                                            {...txt.information.dataset.fieldLabels.doi}
                                            validate={[validation.doi]}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
                                            name="fez_record_search_key_publisher.rek_publisher"
                                            textFieldId="rek-publisher"
                                            type="text"
                                            fullWidth
                                            {...txt.information.dataset.fieldLabels.publisher}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Field
                                            component={PartialDateField}
                                            disabled={props.submitting}
                                            partialDateFieldId="rek-date"
                                            name="rek_date"
                                            allowPartial
                                            required
                                            validate={[validation.required]}
                                            floatingTitle={txt.information.dataset.fieldLabels.date.title}
                                            floatingTitleRequired
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard
                                title={txt.information.dataset.fieldLabels.fieldOfResearchCodes.title}
                                help={txtFoR.help}
                            >
                                <Typography>{txt.information.fieldOfResearchCodes.text}</Typography>
                                <Field
                                    component={FieldOfResearchListField}
                                    name="fieldOfResearch"
                                    listEditorId="field-of-research"
                                    required
                                    validate={[validation.forRequired]}
                                    hideReorder
                                    distinctOnly
                                    disabled={props.submitting}
                                    locale={txt.information.fieldOfResearchCodes.field}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12} className={'Creators'}>
                            <StandardCard title={txt.information.creator.title}>
                                <Field
                                    component={ContributorsEditorField}
                                    name="authors"
                                    contributorEditorId="rek-author"
                                    showRoleInput
                                    showIdentifierLookup
                                    locale={txt.information.creator.field}
                                    required
                                    disabled={props.submitting}
                                    validate={[validation.requiredList]}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard
                                title={txt.information.accessAndLicensing.title}
                                help={getLicenceHelp(txt.information.accessAndLicensing.help)}
                            >
                                <Grid container spacing={3} padding={0}>
                                    <Grid xs={12} sm={12} md={4}>
                                        <Field
                                            component={NewGenericSelectField}
                                            id="data-collection-access-selector"
                                            name="fez_record_search_key_access_conditions.rek_access_conditions"
                                            required
                                            validate={[validation.required]}
                                            disabled={props.submitting}
                                            itemsList={DATASET_ACCESS_CONDITIONS_OPTIONS}
                                            genericSelectFieldId="rek-access-conditions"
                                            {...txt.information.accessAndLicensing.fieldLabels.accessConditions}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={12} md={4}>
                                        <Field
                                            component={NewGenericSelectField}
                                            genericSelectFieldId="rek-license"
                                            id="data-collection-licence-selector"
                                            name="fez_record_search_key_license.rek_license"
                                            required
                                            validate={[validation.required]}
                                            disabled={props.submitting}
                                            itemsList={CURRENT_LICENCES}
                                            {...selectFields.license}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={12} md={4}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
                                            name="fez_record_search_key_rights.rek_rights"
                                            textFieldId="rek-rights"
                                            type="text"
                                            fullWidth
                                            {...txt.information.accessAndLicensing.fieldLabels.copyrightNotice}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txt.information.project.title}>
                                <Grid container spacing={3} padding={0}>
                                    <Grid xs={12}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
                                            name="fez_record_search_key_project_name.rek_project_name"
                                            textFieldId="rek-project-name"
                                            required
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={1}
                                            {...txt.information.project.fieldLabels.projectName}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            component={TextField}
                                            disabled={props.submitting}
                                            name="fez_record_search_key_project_description.rek_project_description"
                                            textFieldId="rek-project-description"
                                            required
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={1}
                                            {...txt.information.project.fieldLabels.projectDescription}
                                            validate={[validation.required]}
                                        />
                                    </Grid>

                                    <Grid xs={12}>
                                        <Field
                                            component={NewListEditorField}
                                            listEditorId="rek-grant-agency"
                                            name="fez_record_search_key_grant_agency"
                                            maxCount={10}
                                            searchKey={{
                                                value: 'rek_grant_agency',
                                                order: 'rek_grant_agency_order',
                                            }}
                                            locale={locale.components.fundingBodyForm.field}
                                            disabled={props.submitting}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            component={NewListEditorField}
                                            listEditorId="rek-grant-id"
                                            name="fez_record_search_key_grant_id"
                                            maxCount={10}
                                            searchKey={{ value: 'rek_grant_id', order: 'rek_grant_id_order' }}
                                            locale={locale.components.grantIdForm.field}
                                            disabled={props.submitting}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txt.information.optionalDatasetDetails.title}>
                                <Grid container spacing={3} padding={0}>
                                    <Grid xs={12}>
                                        <Field
                                            component={NewListEditorField}
                                            listEditorId="rek-type-of-data"
                                            name="fez_record_search_key_type_of_data"
                                            maxCount={10}
                                            searchKey={{
                                                value: 'rek_type_of_data',
                                                order: 'rek_type_of_data_order',
                                            }}
                                            locale={locale.components.typeOfDataForm.fieldDataset}
                                            disabled={props.submitting}
                                        />
                                    </Grid>
                                    <Grid xs={12} style={{ marginLeft: 8, marginRight: 8 }}>
                                        <Divider />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            component={NewListEditorField}
                                            listEditorId="rek-software-required"
                                            name="fez_record_search_key_software_required"
                                            maxCount={10}
                                            searchKey={{
                                                value: 'rek_software_required',
                                                order: 'rek_software_required_order',
                                            }}
                                            locale={locale.components.softwareRequiredForm.field}
                                            disabled={props.submitting}
                                        />
                                    </Grid>
                                    <Grid xs={12} style={{ marginLeft: 8, marginRight: 8 }}>
                                        <Divider />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            component={NewListEditorField}
                                            listEditorId="rek-keywords"
                                            name="fez_record_search_key_keywords"
                                            maxCount={10}
                                            searchKey={{ value: 'rek_keywords', order: 'rek_keywords_order' }}
                                            locale={locale.components.keywordsForm.field}
                                            disabled={props.submitting}
                                            ListEditorForm={KeywordsForm}
                                        />
                                    </Grid>
                                    <Grid xs={12} style={{ marginLeft: 8, marginRight: 8 }}>
                                        <Divider />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Field
                                            component={PartialDateField}
                                            partialDateFieldId="rek-start-date"
                                            disableFuture
                                            autoOk
                                            name="fez_record_search_key_start_date.rek_start_date"
                                            id="rek_start_date"
                                            floatingTitle={
                                                txt.information.optionalDatasetDetails.fieldLabels.collectionStart.label
                                            }
                                            disabled={props.submitting}
                                            validate={[validation.dateRange]}
                                            hasError={dateError}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Field
                                            component={PartialDateField}
                                            partialDateFieldId="rek-end-date"
                                            disableFuture
                                            autoOk
                                            floatingTitle={
                                                txt.information.optionalDatasetDetails.fieldLabels.collectionEnd.label
                                            }
                                            name="fez_record_search_key_end_date.rek_end_date"
                                            id="rek_end_date"
                                            disabled={props.submitting}
                                            validate={[validation.dateRange]}
                                            hasError={dateError}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard
                                title={txt.information.optionalDatasetDetails.fieldLabels.geographicCoordinates.label}
                            >
                                <Typography variant="caption" gutterBottom>
                                    {
                                        txt.information.optionalDatasetDetails.fieldLabels.geographicCoordinates
                                            .description
                                    }
                                </Typography>
                                <Field
                                    component={GeoCoordinatesField}
                                    disabled={props.submitting}
                                    name="geographicArea"
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard
                                title={txt.information.optionalDatasetDetails.fieldLabels.relatedDatasets.title}
                            >
                                <Field
                                    component={RelatedDatasetAndPublicationListField}
                                    listEditorId="related-datasets"
                                    name="fez_record_search_key_isdatasetof"
                                    locale={txt.information.optionalDatasetDetails.fieldLabels.relatedDatasets}
                                    searchKey={{ value: 'rek_isdatasetof', order: 'rek_isdatasetof_order' }}
                                    disabled={props.submitting}
                                    height={50}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txt.information.additionalNotes.title}>
                                <Grid container spacing={2} padding={0}>
                                    <Grid xs={12}>
                                        <Field
                                            component={TextField}
                                            name="fez_record_search_key_notes.rek_notes"
                                            textFieldId="rek-additional-notes"
                                            type="text"
                                            disabled={props.submitting}
                                            fullWidth
                                            multiline
                                            {...txt.information.additionalNotes.fieldLabels.notes}
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Field
                                            component={TextField}
                                            name="rek_link"
                                            textFieldId="rek-link"
                                            type="text"
                                            disabled={props.submitting}
                                            fullWidth
                                            {...txt.information.additionalNotes.fieldLabels.links}
                                            validate={[validation.url]}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid xs={12}>
                            <StandardCard title={txt.fileUpload.title}>
                                <Field
                                    name="files"
                                    component={FileUploadField}
                                    disabled={props.submitting}
                                    requireOpenAccessStatus
                                    locale={txt.fileUpload.fileUploader}
                                    validate={[validation.validFileUpload]}
                                />
                            </StandardCard>
                        </Grid>

                        {alertProps && !props.submitSucceeded && (
                            <Grid xs={12}>
                                <Alert {...alertProps} />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid xs={false} sm />
                        <Grid xs={12} sm="auto">
                            <Button
                                variant="contained"
                                fullWidth
                                children={formLocale.addDataset.cancel}
                                aria-label={formLocale.addDataset.cancel}
                                disabled={props.submitting}
                                onClick={_restartWorkflow}
                                color={'default'}
                            />
                        </Grid>
                        <Grid xs={12} sm="auto">
                            <Button
                                id="submit-data-collection"
                                data-testid="submit-data-collection"
                                variant="contained"
                                color="primary"
                                fullWidth
                                children={formLocale.addDataset.submit}
                                aria-label={formLocale.addDataset.submit}
                                onClick={props.handleSubmit}
                                disabled={props.submitting || disableSubmit}
                            />
                        </Grid>
                    </Grid>
                </form>
            </ConfirmDiscardFormChanges>
        </StandardPage>
    );
};
AddDataCollection.propTypes = {
    ...propTypes, // all redux-form props
    author: PropTypes.object,
    disableSubmit: PropTypes.bool,
    actions: PropTypes.object,
    isSessionValid: PropTypes.bool,
    resetForm: PropTypes.any,
};

export default AddDataCollection;
