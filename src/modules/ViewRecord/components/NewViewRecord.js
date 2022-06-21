/* eslint-disable camelcase */
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

import { DetailedHistory } from './DetailedHistory';

import AdditionalInformation from './AdditionalInformation';
import AvailableVersions from './AvailableVersions';
import Files from './Files';
import GrantInformation from './GrantInformation';
import Links from './Links';
import NtroDetails from './NtroDetails';
import PublicationDetails from './PublicationDetails';
import RelatedPublications from './RelatedPublications';

import { userIsAdmin, userIsAuthor } from 'hooks';
import { AUTH_URL_LOGIN, general } from 'config';
import locale from 'locale/pages';
import globalLocale from 'locale/global';
import * as actions from 'actions';
import { notFound } from '../../../config/routes';
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { makeStyles } from '@material-ui/core/styles';
import AdminViewRecordDrawer from './AdminViewRecordDrawer';
import { Button } from '@material-ui/core';
import fields from 'locale/viewRecord';
import { createDefaultDrawerDescriptorObject } from 'helpers/adminViewRecordObject';
import { doesListContainItem } from 'helpers/general';

import { PUBLICATION_EXCLUDE_CITATION_TEXT_LIST } from '../../../config/general';

export function redirectUserToLogin() {
    window.location.assign(`${AUTH_URL_LOGIN}?url=${window.btoa(window.location.href)}`);
}
const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: 0,
    },
    contentShift: {
        [theme.breakpoints.up('md')]: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: drawerWidth,
        },
    },
    alignVerticalAxisCentre: {
        display: 'flex',
        alignItems: 'center',
    },
    cursor: {
        cursor: 'pointer',
    },
    marginVariableTop: {
        marginTop: -12,
        [theme.breakpoints.up('sm')]: {
            marginTop: -24,
        },
    },
}));

export const NewViewRecord = ({
    account,
    author,
    hideCulturalSensitivityStatement,
    isDeleted,
    isDeletedVersion,
    loadingRecordToView,
    recordToViewError,
    recordToView,
}) => {
    const dispatch = useDispatch();
    const { pid, version } = useParams();
    const isNotFoundRoute = !!pid && pid === notFound;
    const isAdmin = userIsAdmin();
    const isAuthor = userIsAuthor();

    const txt = locale.pages.viewRecord;
    const isNtro = recordToView && !!general.NTRO_SUBTYPES.includes(recordToView.rek_subtype);

    const rekDisplayTypeLowercase = recordToView?.rek_display_type_lookup?.toLowerCase();
    const hideCitationText = doesListContainItem(PUBLICATION_EXCLUDE_CITATION_TEXT_LIST, rekDisplayTypeLowercase);

    const handleSetHideCulturalSensitivityStatement = React.useCallback(
        () => dispatch(actions.setHideCulturalSensitivityStatement()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleMobileDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleDesktopDrawerToggle = () => {
        setOpen(!open);
    };
    const handleDrawerToggle = () => {
        if (window.matchMedia('(max-width:959.96px)').matches) {
            handleMobileDrawerToggle();
        } else {
            handleDesktopDrawerToggle();
        }
    };

    const getAdminRecordButtonIcon = () => {
        return recordToView?.fez_internal_notes?.ain_detail ? (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <Badge
                color="error"
                overlap="circle"
                badgeContent=""
                variant="dot"
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <DescriptionOutlinedIcon fontSize="inherit" />
            </Badge>
        ) : (
            <DescriptionOutlinedIcon fontSize="inherit" onClick={handleDrawerToggle} />
        );
    };

    React.useEffect(() => {
        !!pid &&
            !isNotFoundRoute &&
            dispatch(version ? actions.loadRecordVersionToView(pid, version) : actions.loadRecordToView(pid));

        return () => dispatch(actions.clearRecordToView());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNotFoundRoute, pid, version]);

    const drawerDescriptor = React.useMemo(
        () =>
            recordToView &&
            createDefaultDrawerDescriptorObject(
                txt.adminRecordData.drawer.sectionTitles,
                recordToView,
                fields.viewRecord.adminViewRecordDrawerFields,
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(recordToView)],
    );

    if (!isNotFoundRoute && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (isNotFoundRoute || (recordToViewError && recordToViewError.status === 404)) {
        return (
            <StandardPage className="viewRecord" title={locale.pages.viewRecord.notFound.title}>
                <Grid
                    container
                    className={classes.marginVariableTop}
                    id="notFoundGridContainer"
                    data-testid="notFoundGridContainer"
                >
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
    } else if (!isNotFoundRoute && recordToViewError && recordToViewError.status === 403) {
        return (
            <StandardPage>
                <Alert {...globalLocale.global.loginAlert} action={redirectUserToLogin} />
            </StandardPage>
        );
    } else if (!isNotFoundRoute && (!recordToView || !recordToView.rek_pid)) {
        return <div className="empty" />;
    }

    return (
        <div
            className={clsx(classes.content, {
                [classes.contentShift]: open,
            })}
        >
            <StandardPage
                className="viewRecord"
                title={ReactHtmlParser(recordToView.rek_title)}
                style={{ display: 'flex' }}
            >
                {isAdmin && !isDeleted && !!recordToView && (
                    <AdminViewRecordDrawer
                        content={drawerDescriptor}
                        handleDrawerToggle={handleDrawerToggle}
                        open={open}
                        mobileOpen={mobileOpen}
                    />
                )}
                <Grid container className={classes.marginVariableTop}>
                    <Grid item xs={12}>
                        <PublicationCitation
                            publication={recordToView}
                            hideTitle
                            hideContentIndicators
                            showAdminActions={isAdmin}
                            isPublicationDeleted={isDeleted}
                            citationStyle={'header'}
                            hideCitationText={hideCitationText}
                        />
                    </Grid>

                    {!isDeleted && !!recordToView && (
                        <Grid item xs={12}>
                            <Grid container spacing={2} style={{ marginBottom: 4 }}>
                                {isAdmin && !isDeleted && (
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            startIcon={getAdminRecordButtonIcon()}
                                            color="default"
                                            onClick={handleDrawerToggle}
                                            id="adminDrawerButton"
                                            data-testid="btnAdminToggleDrawerVisibility"
                                        >
                                            {`View ${
                                                recordToView?.fez_internal_notes?.ain_detail ? 'Notes \u0026' : ''
                                            } Record Data`}
                                        </Button>
                                    </Grid>
                                )}
                                <Grid item xs className={classes.alignVerticalAxisCentre}>
                                    {isAdmin && recordToView.rek_status !== general.PUBLISHED && (
                                        <Chip label={recordToView.rek_status_lookup} variant="outlined" />
                                    )}
                                </Grid>
                                <Grid item className={classes.alignVerticalAxisCentre}>
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
                {isAdmin && (
                    <Grid item xs={12} style={{ marginBottom: 24 }}>
                        <DetailedHistory record={recordToView} />
                    </Grid>
                )}
                {isDeleted && (
                    <Grid item xs={12} style={{ marginBottom: 24 }}>
                        <Alert {...txt.deletedAlert} />
                    </Grid>
                )}
                {/* eslint-disable-next-line camelcase */}
                {!!version && !!recordToView?.rek_version && (
                    <Grid item xs={12} style={{ marginBottom: 24 }}>
                        <Alert
                            {...{
                                ...txt.version.alert.version,
                                message: txt.version.alert.version.message(recordToView, isDeletedVersion),
                            }}
                        />
                        <br />
                        <Alert {...txt.version.alert.warning} />
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
            </StandardPage>
        </div>
    );
};

NewViewRecord.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
    hideCulturalSensitivityStatement: PropTypes.bool,
    isDeleted: PropTypes.bool,
    isDeletedVersion: PropTypes.bool,
    loadingRecordToView: PropTypes.bool,
    recordToView: PropTypes.object,
    recordToViewError: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default React.memo(
    NewViewRecord,
    (prevProps, nextProps) => prevProps.loadingRecordToView === nextProps.loadingRecordToView,
);
