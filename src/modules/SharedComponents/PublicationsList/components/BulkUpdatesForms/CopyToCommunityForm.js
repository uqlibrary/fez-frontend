import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/GridLegacy';
import Button from '@mui/material/Button';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { CommunityField } from 'modules/SharedComponents/LookupFields';
import { locale } from 'locale';
import { validation } from 'config';
import { copyToOrRemoveFromCommunity } from 'actions';
import { useValidatedForm } from 'hooks';
import { Field } from '../../../Toolbox/ReactHookForm';
import { useWatch } from 'react-hook-form';

export const CopyToCommunityForm = ({ recordsSelected, onCancel, isRemoveFrom }) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const dispatch = useDispatch();
    const [alertUser, setAlertUser] = useState(null);
    const records = useRef(
        Object.values(recordsSelected).map(record =>
            record.fez_record_search_key_ismemberof.map(community => community.rek_ismemberof),
        ),
    );

    const {
        control,
        safelyHandleSubmit,
        formState: { isSubmitting, isSubmitSuccessful, hasError, serverError },
    } = useValidatedForm();
    const communities = useWatch({ control, name: 'communities' });
    const idText = isRemoveFrom ? 'remove-from' : 'copy-to';

    useEffect(() => {
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

    useEffect(() => {
        if (!isSubmitSuccessful) return;
        setTimeout(onCancel, 2000);
    }, [isSubmitSuccessful, onCancel]);

    const hasMoreThanCollectionsSelected = Object.entries(recordsSelected).some(i => i[1].rek_object_type !== 2);

    const onSubmit = safelyHandleSubmit(
        async data => await dispatch(copyToOrRemoveFromCommunity(Object.values(recordsSelected), data, isRemoveFrom)),
    );

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
                {!hasMoreThanCollectionsSelected && (
                    <Grid item xs={12}>
                        <Field
                            control={control}
                            component={CommunityField}
                            communityFieldId="rek-ismemberof"
                            disabled={isSubmitting || isSubmitSuccessful}
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
                        disabled={isSubmitting}
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
                            hasError ||
                            isSubmitting ||
                            isSubmitSuccessful ||
                            alertUser ||
                            hasMoreThanCollectionsSelected
                        }
                        fullWidth
                        id={`${idText}-community-submit`}
                        onClick={onSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {isSubmitting && (
                        <Alert
                            alertId={`alert-info-${idText}-community`}
                            {...txt.copyToCommunity.submittingAlert(isRemoveFrom)}
                        />
                    )}
                    {isSubmitSuccessful && (
                        <Alert
                            alertId={`alert-done-${idText}-community`}
                            {...txt.copyToCommunity.successAlert(isRemoveFrom)}
                        />
                    )}
                    {serverError && (
                        <Alert
                            alertId={`alert-error-${idText}-community`}
                            {...txt.copyToCommunity.errorAlert(isRemoveFrom)}
                        >
                            {serverError}
                        </Alert>
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

CopyToCommunityForm.propTypes = {
    recordsSelected: PropTypes.object,
    onCancel: PropTypes.func,
    isRemoveFrom: PropTypes.bool,
};

export default React.memo(CopyToCommunityForm);
