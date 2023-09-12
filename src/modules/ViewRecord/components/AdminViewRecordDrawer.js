import React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';

import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import locale from 'locale/pages';
import AdminRecordDrawerSection from './AdminViewRecordDrawerSection';

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
const StyledDrawerContent = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    justifyContent: 'flex-start',
}));

export const DrawerContent = ({ title, content, actions = {}, themeDirection = 'ltr', variant = 'Desktop' }) => {
    return (
        <div
            key="drawContainer1"
            id={`adminDrawerContentContainer${variant}`}
            data-testid={`adminDrawerContentContainer${variant}`}
        >
            <Toolbar sx={{ height: '74px', display: { xs: 'none', md: 'block' } }} key="toolbarMobile" />

            <StyledDrawerContent key="mainHeader">
                <Typography variant={'h6'} tabIndex="0">
                    <IconButton
                        onClick={actions?.handleDrawerToggle}
                        id={`adminRecordDrawerCloseBtn${variant}`}
                        data-analyticsid={`btnAdminRecordDrawerCloseBtn${variant}`}
                        data-testid={`btnAdminRecordDrawerCloseBtn${variant}`}
                        aria-label="Close admin record drawer"
                        size="large"
                    >
                        {/* istanbul ignore next */
                        themeDirection === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    {title}
                </Typography>
            </StyledDrawerContent>
            <Divider key="headerDivider" />
            {content?.sections?.map((section, sectionIndex) => (
                <AdminRecordDrawerSection
                    section={section}
                    index={sectionIndex}
                    copyToClipboard={actions?.writeText}
                    key={`Drawer-Section-${sectionIndex}`}
                    variant={variant}
                />
            ))}
        </div>
    );
};
DrawerContent.propTypes = {
    title: PropTypes.string.isRequired,
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
    actions: PropTypes.object,
    themeDirection: PropTypes.string,
    variant: PropTypes.oneOf(['Desktop', 'Mobile']),
};

export const AdminViewRecordDrawer = ({ content, handleDrawerToggle, open = false, mobileOpen = false }) => {
    const theme = useTheme();
    const [copied, setCopied] = React.useState(false);
    const [error, setError] = React.useState(null);

    /* istanbul ignore next */
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
                    /* istanbul ignore next */
                    theme.direction === 'rtl' ? 'left' : 'right'
                }
                id="adminViewRecordDrawerDesktop"
                data-testid="adminViewRecordDrawerDesktop"
                sx={{ display: { xs: 'none', md: 'block' } }}
            >
                <DrawerContent
                    title={txt.drawer.title}
                    content={content}
                    themeDirection={theme.direction}
                    actions={drawerActions}
                />
            </StyledDesktopDrawer>
            <StyledMobileDrawer
                variant="temporary"
                anchor={
                    /* istanbul ignore next */
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
                <DrawerContent
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
