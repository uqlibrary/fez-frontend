import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { formValueSelector, getFormSyncErrors, change, Field, reduxForm, SubmissionError } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { CommunitySelectField, CollectionSelectField } from 'modules/SharedComponents/SelectFields';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { locale } from 'locale';
import { validation } from 'config';
import { copyToOrRemoveFromCollection } from 'actions';

const FORM_NAME = 'CopyToOrRemoveFromCollectionForm';
const selector = formValueSelector(FORM_NAME);

const onSubmit = (values, dispatch, props) => {
    return dispatch(
        copyToOrRemoveFromCollection(Object.values(props.recordsSelected), values.toJS(), props.isRemoveFrom),
    ).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

const onChange = (values, dispatch, props, prevValues) => {
    if (values.get('community_pid') !== prevValues.get('community_pid')) {
        dispatch(change(FORM_NAME, 'rek_ismemberof', null));
    }
};

export const CopyToOrRemoveFromCollectionForm = ({
    error,
    handleSubmit,
    isRemoveFrom,
    onCancel,
    submitting,
    submitSucceeded,
}) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const communityId = useSelector(state => selector(state, 'community_pid'));
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;
    const idText = isRemoveFrom ? 'remove-from' : 'copy-to';
    return (
        <form data-testid={`${idText}-collection-form`} id={`${idText}-collection-form`}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert
                        alertId={`alert-info-${idText}-collection`}
                        {...txt.copyToOrRemoveFromCollectionForm.alert(isRemoveFrom)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={CommunitySelectField}
                        disabled={submitting || submitSucceeded}
                        genericSelectFieldId="community-pid"
                        label={txt.copyToOrRemoveFromCollectionForm.formLabels.community}
                        name="community_pid"
                        required
                        validate={[validation.required]}
                        {...locale.components.selectField.community}
                    />
                </Grid>
                {!!communityId && (
                    <Grid item xs={12}>
                        <Field
                            component={CollectionSelectField}
                            communityId={!!communityId && communityId}
                            disabled={submitting || submitSucceeded}
                            genericSelectFieldId="rek-ismemberof"
                            label={txt.copyToOrRemoveFromCollectionForm.formLabels.collection}
                            name="rek_ismemberof"
                            required
                            validate={[validation.required]}
                            {...locale.components.selectField.collection}
                        />
                    </Grid>
                )}
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.copyToOrRemoveFromCollectionForm.formLabels.cancelButtonLabel}
                        children={txt.copyToOrRemoveFromCollectionForm.formLabels.cancelButtonLabel}
                        data-testid={`${idText}-collection-cancel`}
                        disabled={submitting}
                        fullWidth
                        id={`${idText}-collection-cancel`}
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        aria-label={txt.copyToOrRemoveFromCollectionForm.formLabels.submitButtonLabel}
                        children={txt.copyToOrRemoveFromCollectionForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-testid={`${idText}-collection-submit`}
                        disabled={submitting || disableSubmit || submitSucceeded}
                        fullWidth
                        id={`${idText}-collection-submit`}
                        onClick={handleSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {!!submitting && (
                        <Alert
                            alertId={`alert-info-${idText}-collection`}
                            {...txt.copyToOrRemoveFromCollectionForm.submittingAlert(isRemoveFrom)}
                        />
                    )}
                    {!!submitSucceeded && (
                        <Alert
                            alertId={`alert-done-${idText}-collection`}
                            {...txt.copyToOrRemoveFromCollectionForm.successAlert(isRemoveFrom)}
                        />
                    )}
                    {!!error && (
                        <Alert
                            alertId={`alert-error-${idText}-collection`}
                            {...txt.copyToOrRemoveFromCollectionForm.errorAlert(isRemoveFrom)}
                        />
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

CopyToOrRemoveFromCollectionForm.propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    isRemoveFrom: PropTypes.bool,
    onCancel: PropTypes.func,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

const CopyToOrRemoveFromCollectionReduxForm = reduxForm({
    form: FORM_NAME,
    onChange,
    onSubmit,
})(CopyToOrRemoveFromCollectionForm);

export default React.memo(CopyToOrRemoveFromCollectionReduxForm);
