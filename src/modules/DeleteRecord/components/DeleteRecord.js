import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

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
import { UQ_DOI_PREFIX } from 'config/general';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

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

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object,
    };

    componentDidMount() {
        if (this.props.actions && this.props.match.params && this.props.match.params.pid) {
            this.props.actions.loadRecordToDelete(this.props.match.params.pid);
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox &&
                this.successConfirmationBox.showConfirmation &&
                this.successConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        // clear previously selected recordToDelete for a delete
        this.props.actions.clearDeleteRecord();
    }

    _hasUQDOI = () => {
        return (
            this.props.recordToDelete &&
            this.props.recordToDelete.fez_record_search_key_doi &&
            this.props.recordToDelete.fez_record_search_key_doi.rek_doi &&
            this.props.recordToDelete.fez_record_search_key_doi.rek_doi.startsWith(UQ_DOI_PREFIX)
        );
    };

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

    _handleDefaultSubmit = event => {
        event && event.preventDefault();
    };

    render() {
        const txt = pagesLocale.pages.deleteRecord;
        const txtDeleteForm = formsLocale.forms.deleteRecordForm;

        if (this.props.accountAuthorLoading || this.props.loadingRecordToDelete) {
            return (
                <React.Fragment>
                    <InlineLoader message={txt.loadingMessage} />
                </React.Fragment>
            );
        }

        const hasUQDOI = this._hasUQDOI();
        const saveConfirmationLocale = { ...txtDeleteForm.successWorkflowConfirmation };
        const alertProps = validation.getErrorAlertProps({ ...this.props, alertLocale: txtDeleteForm });
        return (
            <StandardPage title={txt.title}>
                <ConfirmDiscardFormChanges dirty={this.props.dirty} submitSucceeded={this.props.submitSucceeded}>
                    <form onSubmit={this._handleDefaultSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <StandardCard title={txt.subTitle} help={txt.help}>
                                    <PublicationCitation
                                        publication={this.props.recordToDelete}
                                        citationStyle={'header'}
                                    />
                                </StandardCard>
                            </Grid>
                            {!hasUQDOI && (
                                <React.Fragment>
                                    <NavigationDialogBox
                                        when={this.props.dirty && !this.props.submitSucceeded}
                                        txt={txtDeleteForm.cancelWorkflowConfirmation}
                                    />
                                    <ConfirmDialogBox
                                        onRef={this._setSuccessConfirmation}
                                        onAction={this._navigateToViewPage}
                                        onCancelAction={this._navigateToSearchPage}
                                        locale={saveConfirmationLocale}
                                    />
                                    <Grid item xs={12}>
                                        <StandardCard title={txtDeleteForm.reason.title}>
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
                                                        label={txtDeleteForm.reason.fieldLabels.reason}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </StandardCard>
                                    </Grid>
                                </React.Fragment>
                            )}
                            {alertProps && (
                                <Grid item xs={12}>
                                    <Alert pushToTop {...alertProps} />
                                </Grid>
                            )}
                            {hasUQDOI && (
                                <Grid item xs={12}>
                                    <Alert
                                        message={txtDeleteForm.uqDoiAlert.message(this.props.recordToDelete.rek_pid)}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs />
                            <Grid item>
                                <Button
                                    variant={'contained'}
                                    fullWidth
                                    children={txt.cancel}
                                    disabled={this.props.submitting}
                                    onClick={this._cancel}
                                    id="cancel-delete-record"
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    fullWidth
                                    children={txt.submit}
                                    onClick={this.props.handleSubmit}
                                    disabled={hasUQDOI || this.props.submitting || this.props.disableSubmit}
                                    id="submit-delete-record"
                                    data-testid="delete-admin"
                                />
                            </Grid>
                        </Grid>
                    </form>
                </ConfirmDiscardFormChanges>
            </StandardPage>
        );
    }
}
