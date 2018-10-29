import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {NavigationDialogBox} from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {PartialDateField} from 'modules/SharedComponents/Toolbox/PartialDate';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {FilteredFieldOfResearchListField} from 'modules/SharedComponents/LookupFields';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';
import {FileUploadField} from 'modules/SharedComponents/Toolbox/FileUploader';
import {AccessSelectorField} from 'modules/SharedComponents/Toolbox/AccessSelectorField';
import {LicenseSelectorField} from 'modules/SharedComponents/Toolbox/LicenseSelectorField';
import {GeoCoordinatesField} from 'modules/SharedComponents/Toolbox/GeoCoordinatesField';
import {DatePickerField} from 'modules/SharedComponents/Toolbox/DatePickerField';
import {AuthorIdField} from 'modules/SharedComponents/LookupFields';
import {RelatedDatasetAndPublicationListField} from 'modules/SharedComponents/LookupFields';

import {validation} from 'config';
import locale from 'locale/components';
import {default as formLocale} from 'locale/publicationForm';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DepositAgreementField from './DepositAgreementField';

export default class AddDataCollection extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        author: PropTypes.object,
        disableSubmit: PropTypes.bool,
        actions: PropTypes.object,
        isSessionValid: PropTypes.bool
    };

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.isSessionValid &&
            !nextProps.submitting
        ) {
            this.openDepositConfirmation();
        }
    }

    deposit = () => {
        this.props.actions.checkSession();
    }

    cancelSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.cancelLink);
    }

    afterSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
    }

    openDepositConfirmation = () => {
        this.depositConfirmationBox.showConfirmation();
        this.props.actions.clearSessionExpiredFlag();
    };

    setDepositConfirmation = (ref) => {
        this.depositConfirmationBox = ref;
    };

    render() {
        const txt = formLocale.addDataset;
        const txtFoR = locale.components.fieldOfResearchForm;

        if (this.props.submitSucceeded) {
            return (
                <StandardPage title={formLocale.pageTitle}>
                    <Grid container>
                        <Grid item xs/>
                        <Grid item>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                children={formLocale.dataset.afterSubmit}
                                onClick={this.afterSubmit}/>
                        </Grid>
                    </Grid>
                </StandardPage>
            );
        }
        // customise error for data collection submission
        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                validationAlert: {...formLocale.validationAlert},
                progressAlert: {...formLocale.progressAlert},
                successAlert: {...formLocale.successAlert},
                errorAlert: {
                    ...formLocale.errorAlert,
                    message: formLocale.thesisSubmission.depositFailedMessage
                }
            }});
        return (
            <StandardPage title={formLocale.pageTitle}>
                <form>
                    <NavigationDialogBox
                        when={this.props.dirty && !this.props.submitSucceeded}
                        txt={formLocale.cancelWorkflowConfirmation}/>

                    <ConfirmDialogBox
                        onRef={this.setDepositConfirmation}
                        onAction={this.props.handleSubmit}
                        locale={formLocale.thesisSubmission.depositConfirmation}
                    />
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.agreement.title}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={DepositAgreementField}
                                            depositAgreement={txt.information.agreement.text}
                                            name="depositAgreement"
                                            required
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.dataset.title}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12} sm={12}>
                                        <Field
                                            component={TextField}
                                            autoFocus
                                            disabled={this.props.submitting}
                                            name="rek_title"
                                            required
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={1}
                                            {...txt.information.dataset.fieldLabels.datasetTitle}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Field
                                            component={TextField}
                                            disabled={this.props.submitting}
                                            name="rek_description"
                                            required
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={1}
                                            {...txt.information.dataset.fieldLabels.description}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            disabled={this.props.submitting}
                                            name="contactName"
                                            required
                                            type="text"
                                            fullWidth
                                            {...txt.information.dataset.fieldLabels.contactName}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={AuthorIdField}
                                            disabled={this.props.submitting}
                                            name="contactId"
                                            type="text"
                                            fullWidth
                                            {...txt.information.dataset.fieldLabels.contactId}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Field
                                            component={TextField}
                                            disabled={this.props.submitting}
                                            name="fez_record_search_key_contact_details_email"
                                            required
                                            type="text"
                                            fullWidth
                                            {...txt.information.dataset.fieldLabels.contactEmail}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={TextField}
                                            disabled={this.props.submitting}
                                            name="fez_record_search_key_publisher.rek_publisher"
                                            type="text"
                                            fullWidth
                                            {...txt.information.dataset.fieldLabels.publisher}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            component={PartialDateField}
                                            disabled={this.props.submitting}
                                            name="rek_date"
                                            allowPartial required
                                            className="requiredHintField"
                                            validate={[validation.required]}
                                            floatingTitle={txt.information.dataset.fieldLabels.date.title}
                                            floatingTitleRequired
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.dataset.fieldLabels.fieldOfResearchCodes.title} help={txtFoR.help}>
                                <Typography>{txtFoR.text}</Typography>
                                <Field
                                    component={FilteredFieldOfResearchListField}
                                    name="fieldOfResearch"
                                    required
                                    validate={[validation.forRequired]}
                                    hideReorder
                                    distinctOnly
                                    maxCount={3}
                                    disabled={this.props.submitting}
                                    locale={txtFoR.field}/>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.creator.title}>
                                <Field
                                    component={ContributorsEditorField}
                                    name="authors"
                                    showRoleInput
                                    locale={txt.information.creator.field}
                                    required
                                    disabled={this.props.submitting}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.accessAndLicensing.title} help={txt.information.accessAndLicensing.help}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Field
                                            component={AccessSelectorField}
                                            name="accessCondition"
                                            required
                                            validate={[validation.required]}
                                            disabled={this.props.submitting}
                                            {...txt.information.accessAndLicensing.fieldLabels.accessConditions}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Field
                                            component={LicenseSelectorField}
                                            name="licensingAndTermsOfAccess"
                                            required
                                            validate={[validation.required]}
                                            disabled={this.props.submitting}
                                            {...txt.information.accessAndLicensing.fieldLabels.licensingAndTermsOfAccess}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Field
                                            component={TextField}
                                            disabled={this.props.submitting}
                                            name="copyrightNotice"
                                            type="text"
                                            fullWidth
                                            {...txt.information.accessAndLicensing.fieldLabels.copyrightNotice}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.project.title}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            autoFocus
                                            disabled={this.props.submitting}
                                            name="projectName"
                                            required
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={1}
                                            {...txt.information.project.fieldLabels.projectName}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            autoFocus
                                            disabled={this.props.submitting}
                                            name="projectDescription"
                                            required
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={1}
                                            {...txt.information.project.fieldLabels.projectDescription}
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={ListEditorField}
                                            name="fez_record_search_key_grant_id"
                                            required
                                            maxCount={10}
                                            validate={[validation.requiredList]}
                                            searchKey={{value: 'rek_grant_id', order: 'rek_grant_id_order'}}
                                            locale={locale.components.grantIdForm.field}
                                            disabled={this.props.submitting}/>
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>

                        <Grid item xs={12}>
                            <StandardCard title={txt.information.optionalDatasetDetails.title}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={ListEditorField}
                                            name="fez_record_search_key_type_of_data"
                                            maxCount={10}
                                            searchKey={{value: 'rek_type_of_data', order: 'rek_type_of_data_order'}}
                                            locale={locale.components.typeOfDataForm.field}
                                            disabled={this.props.submitting}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={ListEditorField}
                                            name="fez_record_search_key_software_required"
                                            maxCount={10}
                                            searchKey={{value: 'rek_software_required', order: 'rek_software_required_order'}}
                                            locale={locale.components.softwareRequiredForm.field}
                                            disabled={this.props.submitting}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={ListEditorField}
                                            name="fez_record_search_key_keyword"
                                            maxCount={10}
                                            searchKey={{value: 'rek_keyword', order: 'rek_keyword_order'}}
                                            locale={locale.components.keywordsForm.field}
                                            disabled={this.props.submitting}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6} style={{padding: '0px 20px'}}>
                                        <Typography variant="caption">{txt.information.optionalDatasetDetails.fieldLabels.collectionStart.label}</Typography>
                                        <Field
                                            component={DatePickerField}
                                            autoOk
                                            name="fez_record_search_key_collection_start"
                                            disabled={this.props.submitting}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6} style={{padding: '0px 20px'}}>
                                        <Typography variant="caption">{txt.information.optionalDatasetDetails.fieldLabels.collectionEnd.label}</Typography>
                                        <Field
                                            component={DatePickerField}
                                            autoOk
                                            name="fez_record_search_key_collection_end"
                                            disabled={this.props.submitting}/>
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.optionalDatasetDetails.fieldLabels.geographicCoordinates.label}>
                                <Typography variant="caption" gutterBottom>{txt.information.optionalDatasetDetails.fieldLabels.geographicCoordinates.description}</Typography>
                                <Field
                                    component={GeoCoordinatesField}
                                    name="geographicArea"/>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.optionalDatasetDetails.fieldLabels.relatedDatasets.label}>
                                <Field
                                    component={RelatedDatasetAndPublicationListField}
                                    name="fez_record_search_key_has_related_datasets"
                                    searchKey={{value: 'rek_has_related_datasets', order: 'rek_has_related_datasets_order', lookup: 'rek_has_related_datasets_lookup'}}
                                    disabled={this.props.submitting}
                                    height={50}
                                    validate={[validation.required]}/>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.additionalNotes.title}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="comments"
                                            type="text"
                                            disabled={this.props.submitting}
                                            fullWidth
                                            multiline
                                            {...txt.information.additionalNotes.fieldLabels.notes}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="rek_link"
                                            type="text"
                                            disabled={this.props.submitting}
                                            fullWidth
                                            {...txt.information.additionalNotes.fieldLabels.links}
                                            validate={[validation.url]}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={formLocale.thesisSubmission.fileUpload.title} help={formLocale.thesisSubmission.fileUpload.help}>
                                <Field
                                    name="files"
                                    component={FileUploadField}
                                    disabled={this.props.submitting}
                                    locale={formLocale.thesisSubmission.fileUpload.locale}
                                    defaultQuickTemplateId={this.props.fileAccessId}
                                    validate={[validation.fileUploadRequired]}/>
                            </StandardCard>
                        </Grid>

                        {
                            alertProps &&
                            <Grid item xs={12}>
                                <Alert {...alertProps} />
                            </Grid>
                        }
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={false} sm />
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={formLocale.thesisSubmission.cancel}
                                disabled={this.props.submitting}
                                onClick={this.cancelSubmit}/>
                        </Grid>
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                children={formLocale.thesisSubmission.submit}
                                onClick={this.deposit}
                                disabled={this.props.submitting || this.props.disableSubmit}/>
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
