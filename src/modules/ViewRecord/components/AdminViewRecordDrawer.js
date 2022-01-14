/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import locale from 'locale/pages';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AdminRecordDrawerSection from './AdminViewRecordDrawerSection';

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    drawer: {
        padding: theme.spacing(0, 1),
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerMobile: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    adjustedToolbarHeight: {
        height: '74px',
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            zIndex: 1,
        },
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        justifyContent: 'flex-start',
    },
    drawerContent: {
        padding: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3),
        },
    },
    contentTitle: {
        textTransform: 'uppercase',
        fontWeight: 500,
    },
    notesField: {
        maxHeight: '40vh',
        overflowY: 'auto',
    },
    cursor: {
        cursor: 'pointer',
    },
}));

export const AdminViewRecordDrawer = ({ content, handleDrawerToggle, open = false, mobileOpen = false }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [copied, setCopied] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleSnackbarClose = () => {
        setCopied(false);
        setError(null);
    };
    const txt = locale.pages.viewRecord.adminRecordData;

    const writeText = (event = null, data) => {
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

    const DrawerContent = ({ content }) => {
        return (
            <div key="drawContainer1">
                <Hidden xsDown implementation="css" key="toolbarMobile">
                    <Toolbar className={classes.adjustedToolbarHeight} />
                </Hidden>
                <div className={classes.drawerHeader} key="mainHeader">
                    <Typography variant={'h6'}>
                        <IconButton onClick={handleDrawerToggle}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                        {txt.drawer.title}
                    </Typography>
                </div>
                <Divider key="headerDivider" />
                {content?.sections?.map((section, sectionIndex) => (
                    <AdminRecordDrawerSection
                        section={section}
                        index={sectionIndex}
                        copyToClipboard={writeText}
                        key={`Drawer-Section-${sectionIndex}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <Hidden xsDown implementation="css">
                <Drawer
                    className={classes.drawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    open={open}
                    variant="persistent"
                    anchor={theme.direction === 'rtl' ? 'left' : 'right'}
                    id="adminViewRecordDrawerDesktop"
                >
                    <DrawerContent content={content} />
                </Drawer>
            </Hidden>
            <Hidden smUp implementation="css">
                <Drawer
                    className={classes.drawerMobile}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'left' : 'right'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    id="adminViewRecordDrawerMobile"
                >
                    <DrawerContent content={content} />
                </Drawer>
            </Hidden>
            <Snackbar
                id="copied-text-snackbar"
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
                        value: PropTypes.isRequired,
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
    open: PropTypes.bool.isRequired,
    mobileOpen: PropTypes.bool.isRequired,
};

export default React.memo(AdminViewRecordDrawer);
