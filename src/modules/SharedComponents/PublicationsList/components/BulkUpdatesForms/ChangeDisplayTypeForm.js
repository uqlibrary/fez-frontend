import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { formValueSelector, getFormSyncErrors, change, Field, reduxForm, SubmissionError } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { DocumentTypeSingleField, PublicationSubtypeField } from 'modules/SharedComponents/PublicationSubtype';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { locale } from 'locale';
import { validation } from 'config';
import { usePublicationSubtype } from 'hooks';
import { changeDisplayType } from 'actions';

const FORM_NAME = 'ChangeDisplayTypeForm';
const selector = formValueSelector(FORM_NAME);

const onSubmit = (values, dispatch, props) => {
    return dispatch(changeDisplayType(Object.values(props.recordsSelected), values.toJS(), true)).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

const onChange = (values, dispatch, props, prevValues) => {
    if (values.get('rek_display_type') !== prevValues.get('rek_display_type')) {
        dispatch(change(FORM_NAME, 'rek_subtype', null));
    }
};

export const ChangeDisplayTypeForm = ({ error, handleSubmit, submitting, submitSucceeded, onCancel }) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const displayType = useSelector(state => selector(state, 'rek_display_type'));
    const subtypes = usePublicationSubtype(displayType || null, true);
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;

    React.useEffect(() => {
        if (submitSucceeded) {
            setTimeout(onCancel, 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitSucceeded]);

    return (
        <form data-testid="change-display-type-form" id="change-display-type-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert alertId="alert-info-change-display-type" {...txt.changeDisplayTypeForm.alert} />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={DocumentTypeSingleField}
                        disabled={submitting || submitSucceeded}
                        genericSelectFieldId="rek-display-type"
                        label={txt.changeDisplayTypeForm.formLabels.displayType}
                        name="rek_display_type"
                        required
                        validate={[validation.required]}
                    />
                </Grid>
                {!!displayType && subtypes.length > 0 && (
                    <Grid item xs={12}>
                        <Field
                            component={PublicationSubtypeField}
                            displayType={!!displayType && displayType}
                            disabled={submitting || submitSucceeded}
                            label={txt.changeDisplayTypeForm.formLabels.subtype}
                            name="rek_subtype"
                            required
                            validate={[validation.required]}
                        />
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeDisplayTypeForm.formLabels.cancelButtonLabel}
                        children={txt.changeDisplayTypeForm.formLabels.cancelButtonLabel}
                        data-analyticsid="change-display-type-cancel"
                        data-testid="change-display-type-cancel"
                        disabled={submitting}
                        fullWidth
                        id="change-display-type-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeDisplayTypeForm.formLabels.submitButtonLabel}
                        children={txt.changeDisplayTypeForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-analyticsid="change-display-type-submit"
                        data-testid="change-display-type-submit"
                        disabled={submitting || disableSubmit || submitSucceeded}
                        fullWidth
                        id="change-display-type-submit"
                        onClick={handleSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {!!submitting && (
                        <Alert
                            alertId="alert-info-change-display-type"
                            {...txt.changeDisplayTypeForm.submittingAlert}
                        />
                    )}
                    {!!submitSucceeded && (
                        <Alert alertId="alert-done-change-display-type" {...txt.changeDisplayTypeForm.successAlert} />
                    )}
                    {!!error && (
                        <Alert alertId="alert-error-change-display-type" {...txt.changeDisplayTypeForm.errorAlert} />
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

ChangeDisplayTypeForm.propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

const ChangeDisplayTypeReduxForm = reduxForm({
    form: FORM_NAME,
    onChange,
    onSubmit,
})(ChangeDisplayTypeForm);

export default React.memo(ChangeDisplayTypeReduxForm);
