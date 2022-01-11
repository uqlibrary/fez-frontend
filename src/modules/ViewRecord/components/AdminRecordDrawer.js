/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import locale from 'locale/pages';
import { makeStyles, useTheme } from '@material-ui/core/styles';

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
    notesTitle: {
        textTransform: 'uppercase',
        fontWeight: 300,
    },
    notesField: {
        maxHeight: '40vh',
        overflowY: 'auto',
    },
    cursor: {
        cursor: 'pointer',
    },
}));

const AdminViewRecordDrawer = ({ publication, handleDrawerToggle, open = false, mobileOpen = false }) => {
    const classes = useStyles();
    const theme = useTheme();
    const txt = locale.pages.viewRecord;

    const ContentBlockWithClipboard = ({ title, content }) => {
        const [copied, setCopied] = React.useState(false);
        const [error, setError] = React.useState(null);

        const handleSnackbarClose = () => {
            setCopied(false);
            setError(null);
        };

        const writeText = (event = null, data) => {
            event && event.stopPropagation && event.stopPropagation();

            if (!navigator.clipboard) {
                setError(txt.adminRecordData.clipboard.unavailable);
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

        return (
            <>
                <Typography variant={'subtitle2'} className={classes.notesTitle}>
                    {title}
                </Typography>
                <Typography variant={'body2'} component="div" gutterBottom>
                    {content}
                    {content && (
                        <>
                            <FileCopyOutlinedIcon
                                fontSize="inherit"
                                onClick={e => writeText(e, content)}
                                className={classes.cursor}
                            />
                            <Snackbar
                                id="copied-text-snackbar"
                                data-testid="copied-text-snackbar"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                open={copied || error !== null}
                                onClose={handleSnackbarClose}
                                message={copied ? txt.adminRecordData.clipboard.copied : error}
                                autoHideDuration={2000}
                            />
                        </>
                    )}
                </Typography>
            </>
        );
    };

    const drawerContent = (
        <div>
            <Hidden xsDown implementation="css">
                <Toolbar className={classes.adjustedToolbarHeight} />
            </Hidden>
            <div className={classes.drawerHeader}>
                <Typography variant={'h6'}>
                    <IconButton onClick={handleDrawerToggle}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                    {txt.adminRecordData.drawer.title}
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle1'} className={classes.notesTitle}>
                    {txt.adminRecordData.drawer.sectionTitles.notes}
                </Typography>
                <Typography variant={'body2'} component={'div'} className={classes.notesField}>
                    {ReactHtmlParser(publication?.fez_internal_notes?.ain_detail) ?? ''}
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle1'} className={classes.notesTitle}>
                    {txt.adminRecordData.drawer.sectionTitles.authorAffiliations}
                </Typography>
                <Typography variant={'body2'}>
                    {publication?.fez_record_search_key_author_affiliation_name?.length > 0 ? 'Yes' : 'No'}
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <ContentBlockWithClipboard
                    title={txt.adminRecordData.drawer.sectionTitles.wosId}
                    content={publication?.fez_record_search_key_isi_loc?.rek_isi_loc}
                />

                <Typography variant={'subtitle1'} className={classes.notesTitle}>
                    {txt.adminRecordData.drawer.sectionTitles.wosDocType}
                </Typography>
                <Typography variant={'body2'}>@ - Article</Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <ContentBlockWithClipboard
                    title={txt.adminRecordData.drawer.sectionTitles.scopusId}
                    content={publication?.fez_record_search_key_scopus_id?.rek_scopus_id}
                />

                <Typography variant={'subtitle1'} className={classes.notesTitle}>
                    {txt.adminRecordData.drawer.sectionTitles.scopusDocType}
                </Typography>
                <Typography variant={'body2'}>ar - Article</Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <ContentBlockWithClipboard title={txt.adminRecordData.drawer.sectionTitles.pubmedId} content="353732" />

                <Typography variant={'subtitle1'} className={classes.notesTitle}>
                    {txt.adminRecordData.drawer.sectionTitles.pubmedDocType}
                </Typography>
                <Typography variant={'body2'}>Journal Article</Typography>
            </div>
        </div>
    );

    ContentBlockWithClipboard.propTypes = {
        title: PropTypes.string,
        content: PropTypes.string,
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
                >
                    {drawerContent}
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
                >
                    {drawerContent}
                </Drawer>
            </Hidden>
        </>
    );
};

AdminViewRecordDrawer.propTypes = {
    publication: PropTypes.object,
    handleDrawerToggle: PropTypes.func,
    open: PropTypes.bool,
    mobileOpen: PropTypes.bool,
};

export default React.memo(AdminViewRecordDrawer, (prevProps, nextProps) => {
    prevProps.open === nextProps.open || prevProps.mobileOpen === nextProps.mobileOpen;
});
