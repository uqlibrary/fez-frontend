import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { formValueSelector, getFormSyncErrors, Field, reduxForm, SubmissionError } from 'redux-form/immutable';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import SearchKeyField, { getSearchKeyValueField } from './SearchKeyField';

import { locale } from 'locale';
import { validation } from 'config';
import { changeSearchKeyValue } from 'actions';

const FORM_NAME = 'ChangeSearchKeyValueForm';
const selector = formValueSelector(FORM_NAME);

const onSubmit = (values, dispatch, props) => {
    return dispatch(changeSearchKeyValue(Object.values(props.recordsSelected), values.toJS())).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

export const ChangeSearchKeyValueForm = ({ error, handleSubmit, submitting, submitSucceeded, onCancel }) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const searchKey = useSelector(state => selector(state, 'search_key'));
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;

    React.useEffect(() => {
        if (submitSucceeded) {
            setTimeout(onCancel, 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitSucceeded]);

    return (
        <form data-testid="change-search-key-value-form" id="change-search-key-value-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Field
                        component={SearchKeyField}
                        disabled={submitting || submitSucceeded}
                        genericSelectFieldId="search-key"
                        label={txt.changeSearchKeyValueForm.formLabels.searchKey}
                        name="search_key"
                        required
                        validate={[validation.required]}
                    />
                </Grid>
                {!!searchKey && (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <Field
                                component={getSearchKeyValueField(searchKey).component}
                                disabled={submitting || submitSucceeded}
                                label={txt.changeSearchKeyValueForm.formLabels.searchKeyValue}
                                name={searchKey}
                                required
                                validate={[validation.required]}
                                {...getSearchKeyValueField(searchKey).componentProps}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                fullWidth
                                textFieldId="edit-reason"
                                disabled={submitting || submitSucceeded}
                                label={txt.changeSearchKeyValueForm.formLabels.editNotes}
                                name="edit_reason"
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </React.Fragment>
                )}
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeSearchKeyValueForm.formLabels.cancelButtonLabel}
                        children={txt.changeSearchKeyValueForm.formLabels.cancelButtonLabel}
                        data-analyticsid="change-search-key-value-cancel"
                        data-testid="change-search-key-value-cancel"
                        disabled={submitting}
                        fullWidth
                        id="change-search-key-value-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeSearchKeyValueForm.formLabels.submitButtonLabel}
                        children={txt.changeSearchKeyValueForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-analyticsid="change-search-key-value-submit"
                        data-testid="change-search-key-value-submit"
                        disabled={submitting || disableSubmit || submitSucceeded}
                        fullWidth
                        id="change-search-key-value-submit"
                        onClick={handleSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {!!submitting && (
                        <Alert
                            alertId="alert-info-change-search-key-value"
                            {...txt.changeSearchKeyValueForm.submittingAlert}
                        />
                    )}
                    {!!submitSucceeded && (
                        <Alert
                            alertId="alert-done-change-search-key-value"
                            {...txt.changeSearchKeyValueForm.successAlert}
                        />
                    )}
                    {!!error && (
                        <Alert
                            alertId="alert-error-change-search-key-value"
                            {...txt.changeSearchKeyValueForm.errorAlert}
                        />
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

ChangeSearchKeyValueForm.propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

const ChangeSearchKeyValueReduxForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(ChangeSearchKeyValueForm);

export default React.memo(ChangeSearchKeyValueReduxForm);
