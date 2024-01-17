import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { default as pagesLocale } from 'locale/pages';
import { default as formsLocale } from 'locale/forms';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { pathConfig, validation } from 'config';
import {
    DELETED,
    DOI_CROSSREF_PREFIX,
    DOI_DATACITE_PREFIX,
    PUBLICATION_EXCLUDE_CITATION_TEXT_LIST,
} from 'config/general';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { doesListContainItem } from 'helpers/general';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';

export default class DeleteRecord extends PureComponent {
    static propTypes = {
        ...propTypes, // all redux-form props
        recordToDelete: PropTypes.object,
        loadingRecordToDelete: PropTypes.bool,
        accountAuthorLoading: PropTypes.bool,
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        errors: PropTypes.object,
    };

    componentDidMount() {
        if (this.props.actions && this.props.match.params && this.props.match.params.pid) {
            this.props.actions.loadRecordToDelete(this.props.match.params.pid);
        }
    }

    componentDidUpdate(prevProps) {
        /* istanbul ignore else */
        if (prevProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox &&
                this.successConfirmationBox.showConfirmation &&
                this.successConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        // clear previously selected recordToDelete for a delete
        this.props.actions.clearDeleteRecord();
    }

    #COMMUNITY_COLLECTION_KEY = 'communityCollection';

    _navigateToSearchPage = () => {
        this.props.history.push(pathConfig.records.search);
    };

    _navigateToViewPage = () => {
        this.props.history.push(pathConfig.records.view(this.props.match.params.pid));
    };

    _setSuccessConfirmation = ref => {
        this.successConfirmationBox = ref;
    };

    _cancel = () => {
        this.props.history.goBack();
    };
    /* istanbul ignore next */
    _handleDefaultSubmit = event => {
        event && event.preventDefault();
    };

    _getCustomAlertMessage = (key, statusCode) => {
        const errorObject = formsLocale.forms.deleteRecordForm.errorCustom[key]?.find(customError => {
            return customError.httpStatus === statusCode;
        });

        /* istanbul ignore next */
        const message = !!errorObject ? errorObject.message : formsLocale.forms.deleteRecordForm.errorAlert.message;
        return message; // could be string or function
    };

    _getErrorAlertProps = (rekType, errorResponse) => {
        const defaultProps = {
            ...this.props,
            alertLocale: formsLocale.forms.deleteRecordForm,
            error: errorResponse?.message,
        };

        if (rekType !== 'Collection' && rekType !== 'Community') return defaultProps;
        if (errorResponse?.status !== 409) return defaultProps;

        // if we're working with a collection or community and have received a 409 status error,
        // we know for sure the reason for the failure is because the community contains collections,
        // or the collection contains records. Therefore modify the object to be passed to
        // validation.getErrorAlertProps to change the error message shown to the admin user.
        const errorMessage = this._getCustomAlertMessage(this.#COMMUNITY_COLLECTION_KEY, errorResponse.status);
        return {
            ...defaultProps,
            error: rekType,
            alertLocale: {
                errorAlert: {
                    ...formsLocale.forms.deleteRecordForm.errorAlert,
                    message: errorMessage,
                },
            },
        };
    };

    render() {
        const txt = pagesLocale.pages.deleteRecord;
        const formTxt = formsLocale.forms.deleteRecordForm;

        if (this.props.accountAuthorLoading || this.props.loadingRecordToDelete) {
            return (
                <React.Fragment>
                    <InlineLoader message={txt.loadingMessage} />
                </React.Fragment>
            );
        }

        const hasCrossrefDoi = this.props.recordToDelete?.fez_record_search_key_doi?.rek_doi?.startsWith(
            DOI_CROSSREF_PREFIX,
        );

        const hasDataCiteDoi = this.props.recordToDelete?.fez_record_search_key_doi?.rek_doi?.startsWith(
            DOI_DATACITE_PREFIX,
        );

        const saveConfirmationLocale = { ...formTxt.successWorkflowConfirmation };

        const errorResponse = this.props.error && JSON.parse(this.props.error);
        const errorAlertProps = this._getErrorAlertProps(
            // eslint-disable-next-line camelcase
            this.props?.recordToDelete?.rek_display_type_lookup,
            errorResponse,
        );

        const alertProps = validation.getErrorAlertProps({ ...errorAlertProps });

        // eslint-disable-next-line camelcase
        const rekDisplayTypeLowercase = this.props.recordToDelete?.rek_display_type_lookup?.toLowerCase();
        const hideCitationText = doesListContainItem(PUBLICATION_EXCLUDE_CITATION_TEXT_LIST, rekDisplayTypeLowercase);
        const isDeleted = this.props.recordToDelete?.rek_status === DELETED;

        return (
            <StandardPage title={txt.title(isDeleted)}>
                <ConfirmDiscardFormChanges dirty={this.props.dirty} submitSucceeded={this.props.submitSucceeded}>
                    <form onSubmit={this._handleDefaultSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <StandardCard title={txt.subTitle(isDeleted)} help={txt.help}>
                                    <PublicationCitation
                                        publication={this.props.recordToDelete}
                                        citationStyle={'header'}
                                        hideCitationText={hideCitationText}
                                    />
                                </StandardCard>
                            </Grid>
                            <NavigationDialogBox
                                when={this.props.dirty && !this.props.submitSucceeded}
                                txt={formTxt.cancelWorkflowConfirmation}
                            />
                            <ConfirmDialogBox
                                onRef={this._setSuccessConfirmation}
                                onAction={this._navigateToViewPage}
                                onCancelAction={this._navigateToSearchPage}
                                locale={saveConfirmationLocale}
                            />
                            <Grid item xs={12}>
                                <StandardCard title={formTxt.reason.title(isDeleted)}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Field
                                                component={TextField}
                                                textFieldId="reason"
                                                disabled={this.props.submitting}
                                                name="reason"
                                                type="text"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label={formTxt.reason.label(isDeleted)}
                                                validate={[validation.spacelessMaxLength255Validator]}
                                            />
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                            {hasCrossrefDoi && (
                                <Grid item xs={12}>
                                    <StandardCard title={formTxt.doiResolutionUrl.title}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Field
                                                    component={TextField}
                                                    disabled={this.props.submitting}
                                                    name="publication.fez_record_search_key_doi_resolution_url.rek_doi_resolution_url"
                                                    textFieldId="rek-doi-resolution-url"
                                                    type="text"
                                                    fullWidth
                                                    validate={[
                                                        validation.url,
                                                        validation.spacelessMaxLength255Validator,
                                                    ]}
                                                    label={formTxt.doiResolutionUrl.label}
                                                    placeholder={formTxt.doiResolutionUrl.placeholder}
                                                />
                                            </Grid>
                                        </Grid>
                                    </StandardCard>
                                </Grid>
                            )}
                            {hasDataCiteDoi && (
                                <>
                                    <Grid item xs={12}>
                                        <StandardCard title={formTxt.newDoi.title}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        disabled={this.props.submitting}
                                                        name="publication.fez_record_search_key_new_doi.rek_new_doi"
                                                        textFieldId="rek-new-doi"
                                                        type="text"
                                                        fullWidth
                                                        validate={[
                                                            validation.doi,
                                                            validation.spacelessMaxLength255Validator,
                                                        ]}
                                                        label={formTxt.newDoi.label}
                                                        placeholder={formTxt.newDoi.placeholder}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </StandardCard>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <StandardCard title={formTxt.notes.title}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={RichEditorField}
                                                        name="publication.fez_record_search_key_deletion_notes.rek_deletion_notes"
                                                        textFieldId="rek-deletion-notes-text"
                                                        richEditorId="rek-deletion-notes"
                                                        disabled={this.props.submitting}
                                                        fullWidth
                                                        multiline
                                                        rows={5}
                                                        validate={[validation.maxListEditorTextLength2000]}
                                                        maxValue={2000}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </StandardCard>
                                    </Grid>
                                </>
                            )}
                            {alertProps && (
                                <Grid item xs={12}>
                                    <Alert pushToTop {...alertProps} />
                                </Grid>
                            )}
                        </Grid>
                        <Grid container spacing={3} style={{ marginTop: 8 }}>
                            <Grid item xs />
                            <Grid item>
                                <Button
                                    variant={'contained'}
                                    fullWidth
                                    children={txt.cancel}
                                    disabled={this.props.submitting}
                                    onClick={this._cancel}
                                    id="cancel-delete-record"
                                    data-testid="cancel-delete-record"
                                    data-analyticsid="cancel-delete-record"
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    fullWidth
                                    children={txt.submit(isDeleted)}
                                    onClick={this.props.handleSubmit}
                                    disabled={this.props.submitting || this.props.disableSubmit}
                                    id="submit-delete-record"
                                    data-analyticsid="delete-admin"
                                    data-testid="submit-delete-record"
                                />
                            </Grid>
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </StandardPage>
        );
    }
}
