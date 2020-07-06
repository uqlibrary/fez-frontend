import React from 'react';
import { useDispatch } from 'react-redux';
import { useRecordContext } from 'context';
import Grid from '@material-ui/core/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import pageLocale from 'locale/pages';
import { unlockRecordToView } from 'actions';

export const LockedAlert = () => {
    const { record } = useRecordContext();
    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleAction = React.useCallback(() => dispatch(unlockRecordToView()), []);

    return (
        <Grid container style={{ marginTop: 12, marginBottom: 12 }}>
            <Grid item xs={12}>
                <Alert
                    {...pageLocale.pages.edit.alerts.lockedAlert}
                    action={handleAction}
                    message={pageLocale.pages.edit.alerts.lockedAlert.message
                        .replace('[username]', record.rek_editing_user)
                        .replace('[name]', record.rek_editing_user_lookup)}
                    wiggle
                    disableAlertClick
                />
            </Grid>
        </Grid>
    );
};

export default LockedAlert;
