import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getFormSyncErrors, Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { CollectionField } from 'modules/SharedComponents/LookupFields';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { locale } from 'locale';
import { validation } from 'config';
import { copyToOrRemoveFromCollection } from 'actions';

const FORM_NAME = 'CopyToOrRemoveFromCollectionForm';

const onSubmit = (values, dispatch, props) => {
    return dispatch(
        copyToOrRemoveFromCollection(Object.values(props.recordsSelected), values.toJS(), props.isRemoveFrom),
    ).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

const selector = formValueSelector(FORM_NAME);

export const CopyToOrRemoveFromCollectionForm = ({
    error,
    handleSubmit,
    isRemoveFrom,
    onCancel,
    recordsSelected,
    submitting,
    submitSucceeded,
}) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const records = React.createRef(null);
    const [alertUser, setAlertUser] = React.useState(null);
    records.current = Object.values(recordsSelected).map(record =>
        record.fez_record_search_key_ismemberof.map(collection => collection.rek_ismemberof),
    );
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const collections = useSelector(state => selector(state, 'collections'));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;
    const idText = isRemoveFrom ? 'remove-from' : 'copy-to';

    React.useEffect(() => {
        if (isRemoveFrom) {
            const collectionsSet = Immutable.Set(
                (!!collections && collections.map(collection => collection.rek_pid)) || [],
            );
            setAlertUser(
                records.current.filter(recordCollections =>
                    collectionsSet.isSuperset(Immutable.Set(recordCollections).sort()),
                ).length > 0,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collections]);

    React.useEffect(() => {
        if (submitSucceeded) {
            setTimeout(onCancel, 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitSucceeded]);

    const hasACollectionSelected = Object.entries(recordsSelected).some(i => i[1].rek_object_type === 2);

    return (
        <form data-testid={`${idText}-collection-form`} id={`${idText}-collection-form`}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert
                        alertId={`alert-info-${idText}-collection`}
                        {...txt.copyToOrRemoveFromCollectionForm.alert(isRemoveFrom)}
                    />
                </Grid>
                {!!hasACollectionSelected && (
                    <Grid item xs={12}>
                        <Alert
                            alertId={`alert-info-${idText}-collection-notallowed`}
                            {...txt.copyToOrRemoveFromCollectionForm.onlyRecordsAllowed}
                        />
                    </Grid>
                )}
                {!!alertUser && (
                    <Grid item xs={12}>
                        <Alert
                            alertId={`alert-warning-${idText}-collection`}
                            {...txt.copyToOrRemoveFromCollectionForm.warningAlert}
                        />
                    </Grid>
                )}
                {!!!hasACollectionSelected && (
                    <Grid item xs={12}>
                        <Field
                            component={CollectionField}
                            collectionFieldId="rek-ismemberof"
                            disabled={submitting || submitSucceeded}
                            floatingLabelText={txt.copyToOrRemoveFromCollectionForm.formLabels.collection}
                            fullWidth
                            name="collections"
                            required
                            validate={[validation.requiredList]}
                            {...locale.components.selectField.collection}
                        />
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.copyToOrRemoveFromCollectionForm.formLabels.cancelButtonLabel}
                        children={txt.copyToOrRemoveFromCollectionForm.formLabels.cancelButtonLabel}
                        data-analyticsid={`${idText}-collection-cancel`}
                        data-testid={`${idText}-collection-cancel`}
                        disabled={submitting}
                        fullWidth
                        id={`${idText}-collection-cancel`}
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.copyToOrRemoveFromCollectionForm.formLabels.submitButtonLabel}
                        children={txt.copyToOrRemoveFromCollectionForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-analyticsid={`${idText}-collection-submit`}
                        data-testid={`${idText}-collection-submit`}
                        disabled={
                            submitting || disableSubmit || submitSucceeded || !!alertUser || !!hasACollectionSelected
                        }
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
    recordsSelected: PropTypes.object,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

const CopyToOrRemoveFromCollectionReduxForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(CopyToOrRemoveFromCollectionForm);

export default React.memo(CopyToOrRemoveFromCollectionReduxForm);
