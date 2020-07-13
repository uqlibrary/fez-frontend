import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useRecordContext, useAccountContext } from 'context';
import Grid from '@material-ui/core/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import pageLocale from 'locale/pages';
import { unlockRecordToView } from 'actions';

export const LockedAlert = ({ handleCancel }) => {
    const { record } = useRecordContext();
    const { account } = useAccountContext();
    const dispatch = useDispatch();
    const selfLocked = React.useRef(account.id === record.rek_editing_user);
    const alert = React.useRef(
        selfLocked.current ? pageLocale.pages.edit.alerts.selfLockedAlert : pageLocale.pages.edit.alerts.lockedAlert,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleAction = React.useCallback(() => dispatch(unlockRecordToView()), []);

    return (
        <Grid container style={{ marginTop: 12, marginBottom: 12 }}>
            <Grid item xs={12}>
                <Alert
                    {...alert.current}
                    action={selfLocked.current ? handleCancel : handleAction}
                    message={alert.current.message
                        .replace('[username]', record.rek_editing_user)
                        .replace('[name]', record.rek_editing_user_lookup)}
                    wiggle
                    disableAlertClick
                />
            </Grid>
        </Grid>
    );
};

LockedAlert.propTypes = {
    handleCancel: PropTypes.func,
};

export default LockedAlert;
