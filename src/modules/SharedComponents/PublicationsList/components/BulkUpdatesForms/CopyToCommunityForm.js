import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getFormSyncErrors, Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { CommunityField } from 'modules/SharedComponents/LookupFields';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { locale } from 'locale';
import { validation } from 'config';
import { copyToOrRemoveFromCommunity } from 'actions';

const FORM_NAME = 'CopyToOrRemoveFromCommunityForm';

const onSubmit = (values, dispatch, props) => {
    return dispatch(
        copyToOrRemoveFromCommunity(Object.values(props.recordsSelected), values.toJS(), props.isRemoveFrom),
    ).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

const selector = formValueSelector(FORM_NAME);

export const CopyToCommunityForm = ({
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
        record.fez_record_search_key_ismemberof.map(community => community.rek_ismemberof),
    );
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const communities = useSelector(state => selector(state, 'communities'));
    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;
    const idText = isRemoveFrom ? 'remove-from' : 'copy-to';

    React.useEffect(() => {
        if (isRemoveFrom) {
            const communitySet = Immutable.Set(
                (!!communities && communities.map(community => community.rek_pid)) || [],
            );
            setAlertUser(
                records.current.filter(recordCommunities =>
                    communitySet.isSuperset(Immutable.Set(recordCommunities).sort()),
                ).length > 0,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communities]);

    React.useEffect(() => {
        if (submitSucceeded) {
            setTimeout(onCancel, 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitSucceeded]);

    const hasMoreThanCollectionsSelected = Object.entries(recordsSelected).some(i => i[1].rek_object_type !== 2);

    return (
        <form data-testid={`${idText}-community-form`} id={`${idText}-community-form`}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert alertId={`alert-info-${idText}-community`} {...txt.copyToCommunity.alert(isRemoveFrom)} />
                </Grid>
                {!!hasMoreThanCollectionsSelected && (
                    <Grid item xs={12}>
                        <Alert
                            alertId={`alert-info-${idText}-community-notallowed`}
                            {...txt.copyToCommunity.onlyCollectionsAllowed}
                        />
                    </Grid>
                )}
                {!!alertUser && (
                    <Grid item xs={12}>
                        <Alert alertId={`alert-warning-${idText}-community`} {...txt.copyToCommunity.warningAlert} />
                    </Grid>
                )}
                {!!!hasMoreThanCollectionsSelected && (
                    <Grid item xs={12}>
                        <Field
                            component={CommunityField}
                            communityFieldId="rek-ismemberof"
                            disabled={submitting || submitSucceeded}
                            floatingLabelText={`${isRemoveFrom ? 'Remove from ' : 'Add to '} ${
                                txt.copyToCommunity.formLabels.community
                            }`}
                            fullWidth
                            name="communities"
                            required
                            validate={[validation.requiredList]}
                            {...locale.components.selectField.community}
                        />
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.copyToCommunity.formLabels.cancelButtonLabel}
                        children={txt.copyToCommunity.formLabels.cancelButtonLabel}
                        data-analyticsid={`${idText}-community-cancel`}
                        data-testid={`${idText}-community-cancel`}
                        disabled={submitting}
                        fullWidth
                        id={`${idText}-community-cancel`}
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.copyToCommunity.formLabels.submitButtonLabel}
                        children={txt.copyToCommunity.formLabels.submitButtonLabel}
                        color="primary"
                        data-analyticsid={`${idText}-community-submit`}
                        data-testid={`${idText}-community-submit`}
                        disabled={
                            submitting ||
                            disableSubmit ||
                            submitSucceeded ||
                            !!alertUser ||
                            !!hasMoreThanCollectionsSelected
                        }
                        fullWidth
                        id={`${idText}-community-submit`}
                        onClick={handleSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {!!submitting && (
                        <Alert
                            alertId={`alert-info-${idText}-community`}
                            {...txt.copyToCommunity.submittingAlert(isRemoveFrom)}
                        />
                    )}
                    {!!submitSucceeded && (
                        <Alert
                            alertId={`alert-done-${idText}-community`}
                            {...txt.copyToCommunity.successAlert(isRemoveFrom)}
                        />
                    )}
                    {!!error && (
                        <Alert
                            alertId={`alert-error-${idText}-community`}
                            {...txt.copyToCommunity.errorAlert(isRemoveFrom)}
                        />
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

CopyToCommunityForm.propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    isRemoveFrom: PropTypes.bool,
    onCancel: PropTypes.func,
    recordsSelected: PropTypes.object,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

const CopyToCommunityReduxForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(CopyToCommunityForm);

export default React.memo(CopyToCommunityReduxForm);
