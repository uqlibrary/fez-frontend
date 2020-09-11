import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { formValueSelector, getFormSyncErrors, change, Field, reduxForm } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { DocumentTypeSingleField, PublicationSubtypeField } from 'modules/SharedComponents/PublicationSubtype';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { locale } from 'locale';
import { validation } from 'config';
import { usePublicationSubtype } from 'hooks';
import { changeDisplayType } from 'actions';

const FORM_NAME = 'ChaneDisplayTypeForm';
const selector = formValueSelector(FORM_NAME);

const onSubmit = (values, dispatch, props) => {
    dispatch(changeDisplayType(Object.values(props.recordsSelected), values.toJS()));
};

const onChange = (values, dispatch, props, prevValues) => {
    if (values.get('rek_display_type') !== prevValues.get('rek_display_type')) {
        dispatch(change(FORM_NAME, 'rek_subtype', null));
    }
};

export const ChangeDisplayTypeForm = ({ handleSubmit, submitting, onCancel }) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const displayType = useSelector(state => selector(state, 'rek_display_type'));
    const subtypes = usePublicationSubtype(displayType || null, true);
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;

    return (
        <form data-testid="change-display-type-form" id="change-display-type-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert alertId="alert-info-change-display-type" {...txt.changeDisplayTypeForm.alert} />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={DocumentTypeSingleField}
                        disabled={submitting}
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
                            disabled={submitting}
                            label={txt.changeDisplayTypeForm.formLabels.subtype}
                            name="rek_subtype"
                            required
                            validate={[validation.required]}
                        />
                    </Grid>
                )}
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.changeDisplayTypeForm.formLabels.cancelButtonLabel}
                        children={txt.changeDisplayTypeForm.formLabels.cancelButtonLabel}
                        data-testid="change-display-type-cancel"
                        disabled={submitting}
                        fullWidth
                        id="change-display-type-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.changeDisplayTypeForm.formLabels.submitButtonLabel}
                        children={txt.changeDisplayTypeForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-testid="change-display-type-submit"
                        disabled={submitting || disableSubmit}
                        fullWidth
                        id="change-display-type-submit"
                        onClick={handleSubmit}
                        variant="contained"
                    />
                </Grid>
            </Grid>
        </form>
    );
};

ChangeDisplayTypeForm.propTypes = {
    handleSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    submitting: PropTypes.bool,
};

const ChangeDisplayTypeReduxForm = reduxForm({
    form: FORM_NAME,
    onChange,
    onSubmit,
})(ChangeDisplayTypeForm);

// export default React.memo(ChangeDisplayTypeForm);
export default React.memo(ChangeDisplayTypeReduxForm);
