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

const AdminViewRecordDrawer = ({ content, handleDrawerToggle, open = false, mobileOpen = false }) => {
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

    [
        [
            {
                type: 'header',
                value: txt.drawer.sectionTitles.notes,
            },
            {
                type: 'content',
                scrollable: true,
                value: ReactHtmlParser(recordToView?.fez_internal_notes?.ain_detail),
            },
        ],
        {
            type: 'divider',
        },
        [
            {
                type: 'header',
                value: txt.drawer.sectionTitles.authorAffiliations,
            },
            {
                type: 'content',
                value: recordToView?.fez_record_search_key_author_affiliation_name?.length > 0 ? 'Yes' : 'No',
            },
        ],
        {
            type: 'divider',
        },
        [
            {
                type: 'header',
                value: txt.drawer.sectionTitles.wosId,
            },
            {
                type: 'content',
                value: recordToView?.fez_record_search_key_isi_loc?.rek_isi_loc,
                clipboard: true,
            },
            {
                type: 'header',
                value: txt.drawer.sectionTitles.wosDocType,
            },
            {
                type: 'content',
                value: formattedDocTypeString(
                    recordToView?.rek_work_doc_type,
                    recordToView?.rek_wok_doc_type_lookup,
                ),
            },
        ],
        {
            type: 'divider',
        },
        {
            type: 'header',
            value: txt.drawer.sectionTitles.scopusId,
        },
        [
            {
                type: 'content',
                value: recordToView?.fez_record_search_key_scopus_id?.rek_scopus_id,
                clipboard: true,
            },
            {
                type: 'header',
                value: txt.drawer.sectionTitles.scopusDocType,
            },
            {
                type: 'content',
                value: formattedDocTypeString(
                    recordToView?.rek_scopus_doc_type,
                    recordToView?.rek_scopus_doc_type_lookup,
                ),
            },
        ],
        {
            type: 'divider',
        },
        [
            {
                type: 'header',
                value: txt.drawer.sectionTitles.pubmedId,
            },
            {
                type: 'content',
                value: recordToView?.fez_record_search_key_pubmed_id?.rek_pubmed_id,
                clipboard: true,
            },
            {
                type: 'header',
                value: txt.drawer.sectionTitles.pubmedCentralId,
            },
            {
                type: 'content',
                value: recordToView?.fez_record_search_key_pubmed_central_id?.rek_pubmed_central_id,
                clipboard: true,
            },
            {
                type: 'header',
                value: txt.drawer.sectionTitles.pubmedDocType,
            },
            {
                type: 'content',
                value: formattedDocTypeString(
                    recordToView?.rek_pubmed_doc_type,
                    recordToView?.rek_pubmed_doc_type_lookup,
                ),
            },
        ],
    ];

    const DrawerContent = ({content}) => {
        return (
        <div>
            <Hidden xsDown implementation="css">
                <Toolbar className={classes.adjustedToolbarHeight} />
            </Hidden>
            <div className={classes.drawerHeader}>
                <Typography variant={'h6'}>
                    <IconButton onClick={handleDrawerToggle}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                    {txt.drawer.title}
                </Typography>
            </div>
            <Divider />
            {content.sections.map(section => {
                typeof section === 'object' && section.type === 'divider' && <Divider />;
                Array.isArray(section) && (<div className={classes.drawerContent}>
                    {
                        section.map(block => {
                            block.type === 'header' && <Typography variant={'subtitle2'} className={classes.contentTitle}>{block.value}</Typography>
                        })
                    })
            })} <!-- HERE - trying to iterate this object to dynamically build the drawer content but nested maps are causing issues -->
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle2'} className={classes.contentTitle}>
                    {txt.drawer.sectionTitles.notes}
                </Typography>
                <Typography variant={'body2'} component={'div'} className={classes.notesField}>
                    {ReactHtmlParser(publication?.fez_internal_notes?.ain_detail)}
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle2'} className={classes.contentTitle}>
                    {txt.drawer.sectionTitles.authorAffiliations}
                </Typography>
                <Typography variant={'body2'}>
                    {publication?.fez_record_search_key_author_affiliation_name?.length > 0 ? 'Yes' : 'No'}
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle2'} className={classes.contentTitle}>
                    {txt.drawer.sectionTitles.wosId}
                </Typography>
                <Typography variant={'body2'} component="div" gutterBottom>
                    {publication?.fez_record_search_key_isi_loc?.rek_isi_loc ?? '-'}
                    {publication?.fez_record_search_key_isi_loc?.rek_isi_loc && (
                        <>
                            <FileCopyOutlinedIcon
                                fontSize="inherit"
                                onClick={e => writeText(e, publication?.fez_record_search_key_isi_loc?.rek_isi_loc)}
                                className={classes.cursor}
                            />
                        </>
                    )}
                </Typography>
                <Typography variant={'subtitle2'} className={classes.contentTitle}>
                    {txt.drawer.sectionTitles.wosDocType}
                </Typography>
                <Typography variant={'body2'}>
                    {formattedDocTypeString(publication?.rek_work_doc_type, publication?.rek_wok_doc_type_lookup)}
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle2'} className={classes.contentTitle}>
                    {txt.drawer.sectionTitles.scopusId}
                </Typography>
                <Typography variant={'body2'} component="div" gutterBottom>
                    {publication?.fez_record_search_key_scopus_id?.rek_scopus_id ?? '-'}
                    {publication?.fez_record_search_key_scopus_id?.rek_scopus_id && (
                        <>
                            <FileCopyOutlinedIcon
                                fontSize="inherit"
                                onClick={e => writeText(e, publication?.fez_record_search_key_scopus_id?.rek_scopus_id)}
                                className={classes.cursor}
                            />
                        </>
                    )}
                </Typography>
                <Typography variant={'subtitle2'} className={classes.contentTitle}>
                    {txt.drawer.sectionTitles.scopusDocType}
                </Typography>
                <Typography variant={'body2'}>
                    {formattedDocTypeString(publication?.rek_scopus_doc_type, publication?.rek_scopus_doc_type_lookup)}
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle2'} className={classes.contentTitle}>
                    {txt.drawer.sectionTitles.pubmedId}
                </Typography>
                <Typography variant={'body2'} component="div" gutterBottom>
                    {publication?.fez_record_search_key_pubmed_id?.rek_pubmed_id ?? '-'}
                    {publication?.fez_record_search_key_pubmed_id?.rek_pubmed_id && (
                        <>
                            <FileCopyOutlinedIcon
                                fontSize="inherit"
                                onClick={e => writeText(e, publication.fez_record_search_key_pubmed_id.rek_pubmed_id)}
                                className={classes.cursor}
                            />
                        </>
                    )}
                </Typography>
                <Typography variant={'subtitle2'} className={classes.contentTitle}>
                    {txt.drawer.sectionTitles.pubmedCentralId}
                </Typography>
                <Typography variant={'body2'} component="div" gutterBottom>
                    {publication?.fez_record_search_key_pubmed_central_id?.rek_pubmed_central_id ?? '-'}
                    {publication?.fez_record_search_key_pubmed_central_id?.rek_pubmed_central_id && (
                        <>
                            <FileCopyOutlinedIcon
                                fontSize="inherit"
                                onClick={e =>
                                    writeText(
                                        e,
                                        publication.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id,
                                    )
                                }
                                className={classes.cursor}
                            />
                        </>
                    )}
                </Typography>
                <Typography variant={'subtitle2'} className={classes.contentTitle}>
                    {txt.drawer.sectionTitles.pubmedDocType}
                </Typography>
                <Typography variant={'body2'}>
                    {formattedDocTypeString(publication?.rek_pubmed_doc_type, publication?.rek_pubmed_doc_type_lookup)}
                </Typography>
            </div>
        </div>
        )
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
                >
                    <DrawerContent content={content} />
                </Drawer>
            </Hidden>
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
    content: PropTypes.object,
    handleDrawerToggle: PropTypes.func,
    open: PropTypes.bool,
    mobileOpen: PropTypes.bool,
};

export default React.memo(AdminViewRecordDrawer, (prevProps, nextProps) => {
    prevProps.open === nextProps.open || prevProps.mobileOpen === nextProps.mobileOpen;
});
