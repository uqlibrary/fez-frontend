import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { SocialShare } from 'modules/SharedComponents/SocialShare';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import AdditionalInformation from './AdditionalInformation';
import AvailableVersions from './AvailableVersions';
import Files from './Files';
import GrantInformation from './GrantInformation';
import Links from './Links';
import NtroDetails from './NtroDetails';
import PublicationDetails from './PublicationDetails';
import RelatedPublications from './RelatedPublications';

import { userIsAdmin, userIsAuthor } from 'hooks';
import { general, AUTH_URL_LOGIN } from 'config';
import locale from 'locale/pages';
import globalLocale from 'locale/global';
import * as actions from 'actions';
import clsx from 'clsx';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SpeakerNotesOutlinedIcon from '@material-ui/icons/SpeakerNotesOutlined';
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
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
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
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3),
        },
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: 0,
    },
    contentShift: {
        [theme.breakpoints.up('sm')]: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,
        },
    },
    drawerContent: {
        padding: '20px',
    },
    notesField: {
        maxHeight: '40vh',
        overflowY: 'auto',
    },
    iconSuper: {
        verticalAlign: 'super',
        marginLeft: '-4px',
    },
    cursor: {
        cursor: 'pointer',
    },
}));

export function redirectUserToLogin() {
    window.location.assign(`${AUTH_URL_LOGIN}?url=${window.btoa(window.location.href)}`);
}

export const NewViewRecord = ({
    account,
    author,
    hideCulturalSensitivityStatement,
    isDeleted,
    loadingRecordToView,
    recordToViewError,
    recordToView,
}) => {
    const dispatch = useDispatch();
    const { pid } = useParams();
    const isAdmin = userIsAdmin();
    const isAuthor = userIsAuthor();

    const txt = locale.pages.viewRecord;
    const isNtro = recordToView && !!general.NTRO_SUBTYPES.includes(recordToView.rek_subtype);

    const handleSetHideCulturalSensitivityStatement = React.useCallback(
        () => dispatch(actions.setHideCulturalSensitivityStatement()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleMobileDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleDesktopDrawerToggle = () => {
        setOpen(!open);
    };
    const handleDrawerToggle = () => {
        if (window.matchMedia('(max-width:599.96px)').matches) {
            handleMobileDrawerToggle();
        } else {
            handleDesktopDrawerToggle();
        }
    };

    const drawer = (
        <div>
            <Hidden xsDown implementation="css">
                <Toolbar />
            </Hidden>
            <div className={classes.drawerHeader}>
                <Typography variant={'h6'}>
                    <IconButton onClick={handleDrawerToggle}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                    &nbsp;Record Data
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle1'} style={{ textTransform: 'uppercase' }}>
                    Notes
                </Typography>
                <Typography variant={'body2'} className={classes.notesField}>
                    {/* eslint-disable-next-line camelcase */
                    ReactHtmlParser(recordToView?.fez_internal_notes?.ain_detail) ?? ''}
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle1'}>Has Author Affiliations?</Typography>
                <Typography variant={'body2'}>
                    {/* eslint-disable-next-line camelcase */
                    recordToView?.fez_record_search_key_author_affiliation_name?.length > 0 ? 'Yes' : 'No'}
                </Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle1'}>WoS ID</Typography>
                <Typography variant={'body2'} gutterBottom>
                    {
                        /* eslint-disable-next-line camelcase */
                        recordToView?.fez_record_search_key_isi_loc?.rek_isi_loc
                    }
                    {/* eslint-disable-next-line camelcase */
                    recordToView?.fez_record_search_key_isi_loc?.rek_isi_loc && (
                        <FileCopyOutlinedIcon fontSize="inherit" />
                    )}
                </Typography>
                <Typography variant={'subtitle1'}>WoS Doc Type</Typography>
                <Typography variant={'body2'}>@ - Article</Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle1'}>Scopus ID</Typography>
                <Typography variant={'body2'} gutterBottom>
                    {
                        /* eslint-disable-next-line camelcase */
                        recordToView?.fez_record_search_key_scopus_id?.rek_scopus_id
                    }
                    {/* eslint-disable-next-line camelcase */
                    recordToView?.fez_record_search_key_scopus_id?.rek_scopus_id && (
                        <FileCopyOutlinedIcon fontSize="inherit" />
                    )}
                </Typography>
                <Typography variant={'subtitle1'}>Scopus Doc Type</Typography>
                <Typography variant={'body2'}>ar - Article</Typography>
            </div>
            <Divider />
            <div className={classes.drawerContent}>
                <Typography variant={'subtitle1'}>Pubmed ID</Typography>
                <Typography variant={'body2'} gutterBottom>
                    353732 <FileCopyOutlinedIcon fontSize="inherit" />
                </Typography>
                <Typography variant={'subtitle1'}>Pubmed Doc Type</Typography>
                <Typography variant={'body2'}>Journal Article</Typography>
            </div>
        </div>
    );

    React.useEffect(() => {
        !!pid && dispatch(actions.loadRecordToView(pid));

        return () => dispatch(actions.clearRecordToView());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid]);

    if (loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (recordToViewError && recordToViewError.status === 404) {
        return (
            <StandardPage className="viewRecord" title={locale.pages.viewRecord.notFound.title}>
                <Grid container style={{ marginTop: -24 }}>
                    <Grid item xs={12}>
                        {locale.pages.viewRecord.notFound.message}
                    </Grid>
                </Grid>
                {recordToViewError && (
                    <Typography variant={'caption'} style={{ opacity: 0.5 }}>
                        {`(${recordToViewError.status} - ${recordToViewError.message})`}
                    </Typography>
                )}
            </StandardPage>
        );
    } else if (recordToViewError && recordToViewError.status === 403) {
        return (
            <StandardPage>
                <Alert {...globalLocale.global.loginAlert} action={redirectUserToLogin} />
            </StandardPage>
        );
    } else if (!recordToView || !recordToView.rek_pid) {
        return <div className="empty" />;
    }

    const getTitleAndIcon = () => {
        const titleText = ReactHtmlParser(recordToView.rek_title);
        // eslint-disable-next-line camelcase
        const TitleIcon = () => {
            // eslint-disable-next-line camelcase
            return recordToView?.fez_internal_notes?.ain_detail ? (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <span onClick={handleDrawerToggle} className={classes.cursor}>
                    <DescriptionOutlinedIcon fontSize="inherit" />
                    <SpeakerNotesOutlinedIcon fontSize="small" className={classes.iconSuper} />
                </span>
            ) : (
                <DescriptionOutlinedIcon fontSize="inherit" onClick={handleDrawerToggle} className={classes.cursor} />
            );
        };
        return (
            <>
                {titleText}
                <TitleIcon />
            </>
        );
    };

    return (
        <div
            className={clsx(classes.content, {
                [classes.contentShift]: open,
            })}
        >
            <StandardPage className="viewRecord" title={getTitleAndIcon()} style={{ display: 'flex' }}>
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
                        {drawer}
                    </Drawer>
                </Hidden>
                <Grid container style={{ marginTop: -24 }}>
                    <Grid item xs={12}>
                        <PublicationCitation
                            publication={recordToView}
                            hideTitle
                            hideContentIndicators
                            showAdminActions={isAdmin}
                            isPublicationDeleted={isDeleted}
                            citationStyle={'header'}
                        />
                    </Grid>
                    {!isDeleted && !!recordToView && (
                        <Grid item xs={12}>
                            <Grid container spacing={2} style={{ marginBottom: 4 }}>
                                <Grid item xs>
                                    {isAdmin && recordToView.rek_status !== general.PUBLISHED && (
                                        <Chip label={recordToView.rek_status_lookup} variant="outlined" />
                                    )}
                                </Grid>
                                <Grid item>
                                    <SocialShare
                                        publication={recordToView}
                                        services={[
                                            'facebook',
                                            'twitter',
                                            'linkedin',
                                            'researchgate',
                                            'mendeley',
                                            'email',
                                            'print',
                                        ]}
                                        spaceBetween={4}
                                        round
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                {isDeleted && (
                    <Grid item xs={12} style={{ marginBottom: 24 }}>
                        <Alert {...txt.deletedAlert} />
                    </Grid>
                )}
                <Grid container spacing={3}>
                    {!isDeleted && (
                        <React.Fragment>
                            <Files
                                author={author}
                                account={account}
                                publication={recordToView}
                                hideCulturalSensitivityStatement={hideCulturalSensitivityStatement}
                                setHideCulturalSensitivityStatement={handleSetHideCulturalSensitivityStatement}
                                isAdmin={!!isAdmin}
                                isAuthor={!!isAuthor}
                            />
                            <Links publication={recordToView} />
                            <RelatedPublications publication={recordToView} />
                            <AdditionalInformation publication={recordToView} account={account} isNtro={isNtro} />
                            {isNtro && <NtroDetails publication={recordToView} account={account} />}
                            <GrantInformation publication={recordToView} />
                        </React.Fragment>
                    )}
                    <PublicationDetails publication={recordToView} />
                    {!isDeleted && <AvailableVersions publication={recordToView} />}
                </Grid>

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
                        {drawer}
                    </Drawer>
                </Hidden>
            </StandardPage>
        </div>
    );
};

NewViewRecord.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
    hideCulturalSensitivityStatement: PropTypes.bool,
    isDeleted: PropTypes.bool,
    loadingRecordToView: PropTypes.bool,
    recordToView: PropTypes.object,
    recordToViewError: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default React.memo(
    NewViewRecord,
    (prevProps, nextProps) => prevProps.loadingRecordToView === nextProps.loadingRecordToView,
);
