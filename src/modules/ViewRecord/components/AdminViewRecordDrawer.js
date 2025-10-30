import React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';

import Snackbar from '@mui/material/Snackbar';
import Drawer from '@mui/material/Drawer';

import locale from 'locale/pages';
import AdminViewRecordDrawerContent from './AdminViewRecordDrawerContent';

const drawerPaperStyles = theme => ({
    '& .MuiDrawer-paper': {
        width: '260px',
        [theme.breakpoints.up('md')]: {
            zIndex: 1,
        },
    },
});
const StyledDesktopDrawer = styled(Drawer)(({ theme }) => ({
    padding: theme.spacing(0, 1),
    [theme.breakpoints.up('md')]: {
        width: '260px',
        flexShrink: 0,
    },
    ...drawerPaperStyles(theme),
}));
const StyledMobileDrawer = styled(Drawer)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
    ...drawerPaperStyles(theme),
}));

export const AdminViewRecordDrawer = ({ content, handleDrawerToggle, open = false, mobileOpen = false }) => {
    const theme = useTheme();
    const [copied, setCopied] = React.useState(false);
    const [error, setError] = React.useState(null);

    /* c8 ignore next */
    const handleSnackbarClose = () => {
        setCopied(false);
        setError(null);
    };
    const txt = locale.pages.viewRecord.adminRecordData;

    const writeText = (event, data) => {
        event && event.stopPropagation && event.stopPropagation();
        if (!navigator.clipboard) {
            setError(txt.clipboard.unavailable);
            return;
        }
        navigator.clipboard
            ?.writeText(data)
            .then(() => {
                setCopied(true);
            })
            .catch(e => {
                setError(e.message);
            });
    };

    const drawerActions = { handleDrawerToggle, writeText };

    return (
        <>
            <StyledDesktopDrawer
                open={open}
                variant="persistent"
                anchor={
                    /* c8 ignore next */
                    theme.direction === 'rtl' ? 'left' : 'right'
                }
                id="adminViewRecordDrawerDesktop"
                data-testid="adminViewRecordDrawerDesktop"
                sx={{ display: { xs: 'none', md: 'block' } }}
            >
                <AdminViewRecordDrawerContent
                    title={txt.drawer.title}
                    content={content}
                    themeDirection={theme.direction}
                    actions={drawerActions}
                />
            </StyledDesktopDrawer>
            <StyledMobileDrawer
                variant="temporary"
                anchor={
                    /* c8 ignore next */
                    theme.direction === 'rtl' ? 'left' : 'right'
                }
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                id="adminViewRecordDrawerMobile"
                data-testid="adminViewRecordDrawerMobile"
                sx={{ display: { xs: 'block', sm: 'none' } }}
            >
                <AdminViewRecordDrawerContent
                    title={txt.drawer.title}
                    content={content}
                    variant="Mobile"
                    themeDirection={theme.direction}
                    actions={drawerActions}
                />
            </StyledMobileDrawer>
            <Snackbar
                id="copied-text-snackbar"
                data-testid="copied-text-snackbar"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={copied || error !== null}
                onClose={handleSnackbarClose}
                message={copied ? txt.clipboard.copied : error}
                autoHideDuration={2000}
            />
        </>
    );
};

AdminViewRecordDrawer.propTypes = {
    content: PropTypes.shape({
        sections: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.arrayOf(
                    PropTypes.shape({
                        type: PropTypes.string.isRequired,
                        value: PropTypes.any.isRequired,
                        scrollable: PropTypes.bool,
                        key: PropTypes.string,
                        clipboard: PropTypes.bool,
                    }),
                ),
                PropTypes.shape({
                    type: PropTypes.oneOf(['divider']).isRequired,
                }),
            ]).isRequired,
        ).isRequired,
    }).isRequired,
    handleDrawerToggle: PropTypes.func.isRequired,
    open: PropTypes.bool,
    mobileOpen: PropTypes.bool,
};

export default React.memo(AdminViewRecordDrawer);
