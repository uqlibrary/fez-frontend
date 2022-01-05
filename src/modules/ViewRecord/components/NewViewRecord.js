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
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
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
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
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
            <Toolbar />
            <div className={classes.drawerHeader}>
                <Typography variant={'h6'}>
                    <IconButton onClick={handleDrawerToggle}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                    &nbsp;Record Data
                </Typography>
            </div>
            <Divider />
            <Typography variant={'subtitle1'} style={{ textTransform: 'uppercase' }}>
                Notes{' '}
                <a href="#" style={{ textTransform: 'none' }}>
                    [expand]
                </a>
            </Typography>
            <Typography variant={'body1'}>
                Due 28/2/2017 17/6/14 Ds Forthcoming publication - 2016. Dolly MacKinnon (86672) has supplied the
                following correction information: This book chapter is a B1P NOT a BXP. Please fix immediately.i#1806879
                13/3/18 - Publication details via Book Depository:
                https://www.bookdepository.com/Material-Worlds-Childhood-North-Western-Europe-C-1350-1800-Philippa-Maddern/9781472444776
                (MM) Issues on record :: UQ:329852 Description: Record: https://espace.library.uq.edu.au/view/UQ:329852
                User “Dr Dolly...
            </Typography>
            <Divider />
        </div>
    );

    const container = window !== undefined ? window.document.body : undefined;

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
        return (
            <>
                {titleText}
                <Badge
                    onClick={handleDrawerToggle}
                    color="error"
                    overlap="circular"
                    badgeContent=" "
                    variant="dot"
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <DescriptionOutlinedIcon fontSize="inherit" />
                </Badge>
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
                        container={container}
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
                        container={container}
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
