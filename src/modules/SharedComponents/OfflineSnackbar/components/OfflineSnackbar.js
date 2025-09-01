import React from 'react';

import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/GridLegacy';
import Link from '@mui/icons-material/Link';
import LinkOff from '@mui/icons-material/LinkOff';
import locale from 'locale/global';

export const OfflineSnackbar = () => {
    const [state, setState] = React.useState({ open: !navigator.onLine, online: navigator.onLine });

    React.useEffect(() => {
        const updateOnlineState = () => {
            setState({ open: true, online: navigator.onLine });
        };

        window.addEventListener('online', updateOnlineState);
        window.addEventListener('offline', updateOnlineState);

        return () => {
            window.removeEventListener('online', updateOnlineState);
            window.removeEventListener('offline', updateOnlineState);
        };
    }, []);

    const renderMessage = (message, icon) => {
        return (
            <Grid container alignItems={'center'} justifyContent={'center'} alignContent={'center'}>
                <Grid item xs />
                <Grid item style={{ marginRight: 24 }}>
                    {icon}
                </Grid>
                <Grid item>{message}</Grid>
                <Grid item xs />
            </Grid>
        );
    };

    const handleRequestClose = () => {
        setState({ open: false });
    };

    const txt = locale.global.offlineSnackbar;
    const snackbarProps = state.online
        ? {
              ...txt.online,
              message: renderMessage(txt.online.message, <Link sx={{ color: 'success.light' }} />),
          }
        : {
              ...txt.offline,
              message: renderMessage(txt.offline.message, <LinkOff sx={{ color: 'error.light' }} />),
          };

    return (
        <div className="offlineSnackbar">
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={state.open}
                onClose={handleRequestClose}
                message={snackbarProps.message}
                autoHideDuration={snackbarProps.autoHideDuration}
                ClickAwayListenerProps={{
                    onClickAway: /* istanbul ignore next */ () => {
                        /* istanbul ignore next */
                        return false;
                    },
                }}
            />
        </div>
    );
};

export default React.memo(OfflineSnackbar);
