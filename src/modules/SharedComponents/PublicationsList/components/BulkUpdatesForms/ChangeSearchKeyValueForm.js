import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { formValueSelector, getFormSyncErrors, Field, reduxForm, SubmissionError } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { SearchKeyField } from './SearchKeyField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

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
    console.log(searchKey);
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;

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
                <Grid item xs={12}>
                    <Field
                        component={SearchKeyValueField}
                        searchKey={searchKey}
                        disabled={submitting || submitSucceeded}
                        label={txt.changeSearchKeyValueForm.formLabels.searchKey}
                        name="search_key_value"
                        required
                        validate={[validation.required]}
                        searchKeyValueFieldId="search-key-value"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.changeSearchKeyValueForm.formLabels.cancelButtonLabel}
                        children={txt.changeSearchKeyValueForm.formLabels.cancelButtonLabel}
                        data-testid="change-search-key-value-cancel"
                        disabled={submitting}
                        fullWidth
                        id="change-search-key-value-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.changeSearchKeyValueForm.formLabels.submitButtonLabel}
                        children={txt.changeSearchKeyValueForm.formLabels.submitButtonLabel}
                        color="primary"
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
