import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getFormSyncErrors, Field, reduxForm, SubmissionError } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { UqIdField } from 'modules/SharedComponents/LookupFields';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { locale } from 'locale';
import { validation } from 'config';
import { changeAuthorId } from 'actions';

const FORM_NAME = 'ChangeAuthorIdForm';

const onSubmit = (values, dispatch, props) => {
    return dispatch(changeAuthorId(Object.values(props.recordsSelected), values.toJS())).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

export const ChangeAuthorIdForm = ({ error, handleSubmit, submitting, submitSucceeded, onCancel }) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;

    return (
        <form data-testid="change-author-id-form" id="change-author-id-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert alertId="alert-info-change-author-id" {...txt.changeAuthorIdForm.alert} />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={GenericTextField}
                        disabled={submitting || submitSucceeded}
                        textFieldId="rek-author"
                        fullWidth
                        label={txt.changeAuthorIdForm.formLabels.authorName}
                        name="rek_author"
                        required
                        validate={[validation.required]}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={UqIdField}
                        disabled={submitting || submitSucceeded}
                        floatingLabelText={txt.changeAuthorIdForm.formLabels.authorId}
                        name="rek_author_id"
                        required
                        validate={[validation.required]}
                        uqIdFieldId="rek-author-id"
                        getOptionLabel={option => (!!option && `${option.id} (${option.value})`) || ''}
                        normalize={value => value.aut_id}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.changeAuthorIdForm.formLabels.cancelButtonLabel}
                        children={txt.changeAuthorIdForm.formLabels.cancelButtonLabel}
                        data-testid="change-author-id-cancel"
                        disabled={submitting}
                        fullWidth
                        id="change-author-id-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.changeAuthorIdForm.formLabels.submitButtonLabel}
                        children={txt.changeAuthorIdForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-testid="change-author-id-submit"
                        disabled={submitting || disableSubmit || submitSucceeded}
                        fullWidth
                        id="change-author-id-submit"
                        onClick={handleSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {!!submitting && (
                        <Alert alertId="alert-info-change-author-id" {...txt.changeAuthorIdForm.submittingAlert} />
                    )}
                    {!!submitSucceeded && (
                        <Alert alertId="alert-done-change-author-id" {...txt.changeAuthorIdForm.successAlert} />
                    )}
                    {!!error && <Alert alertId="alert-error-change-author-id" {...txt.changeAuthorIdForm.errorAlert} />}
                </Grid>
            </Grid>
        </form>
    );
};

ChangeAuthorIdForm.propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

const ChangeAuthorIdReduxForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(ChangeAuthorIdForm);

export default React.memo(ChangeAuthorIdReduxForm);
