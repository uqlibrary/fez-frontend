import React from 'react';
import { useDispatch } from 'react-redux';
import { useJournalContext, useAccountContext } from 'context';
import Grid from '@mui/material/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import pageLocale from 'locale/pages';
import { adminUnlockJournal } from 'actions';

export const LockedAlert = () => {
    const { journalDetails: journal } = useJournalContext();
    const { account } = useAccountContext();
    const dispatch = useDispatch();

    const selfLocked = React.useRef(account.id === journal.jnl_editing_user);
    const alert = React.useRef(pageLocale.pages.edit.alerts.lockedAlert);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleAction = React.useCallback(() => dispatch(adminUnlockJournal()), []);

    // no locked alert for the first editing user
    if (!!selfLocked.current) {
        return <div data-testid="no-alert" />;
    }

    return (
        <Grid container style={{ marginTop: 12, marginBottom: 12 }}>
            <Grid item xs={12}>
                <Alert
                    {...alert.current}
                    action={handleAction}
                    message={alert.current.message
                        .replace('[username]', journal.jnl_editing_user)
                        .replace('[name]', journal.jnl_editing_user_lookup)}
                    wiggle
                    disableAlertClick
                />
            </Grid>
        </Grid>
    );
};

export default LockedAlert;
