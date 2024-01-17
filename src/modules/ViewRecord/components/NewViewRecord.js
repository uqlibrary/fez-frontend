/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router';

import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AdminViewRecordDrawer from './AdminViewRecordDrawer';
import Button from '@mui/material/Button';

import { belongsToAuthor, userIsAdmin } from 'hooks';
import { AUTH_URL_LOGIN, general } from 'config';
import { PUBLICATION_EXCLUDE_CITATION_TEXT_LIST } from '../../../config/general';
import { notFound } from '../../../config/routes';
import locale from 'locale/pages';
import globalLocale from 'locale/global';
import * as actions from 'actions';
import fields from 'locale/viewRecord';
import { createDefaultDrawerDescriptorObject } from 'helpers/adminViewRecordObject';
import { parseHtmlToJSX, doesListContainItem } from 'helpers/general';
import { composeAuthorAffiliationProblems } from 'helpers/authorAffiliations';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { SocialShare } from 'modules/SharedComponents/SocialShare';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { DetailedHistory } from './DetailedHistory';
import { shouldHandleAuthorAffiliations } from 'modules/Admin/helpers';
import AdditionalInformation from './AdditionalInformation';
import AvailableVersions from './AvailableVersions';
import Files from './Files';
import GrantInformation from './GrantInformation';
import Links from './Links';
import NtroDetails from './NtroDetails';
import PublicationDetails from './PublicationDetails';
import RelatedPublications from './RelatedPublications';

export function redirectUserToLogin() {
    window.location.assign(`${AUTH_URL_LOGIN}?url=${window.btoa(window.location.href)}`);
}

const contentStyles = theme => ({
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
});
const contentStylesOpen = theme => ({
    [theme.breakpoints.up('md')]: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: '260px',
    },
});

const StyledContentWrapper = styled('div', {
    shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
    flexGrow: 1,
    ...(!open ? { ...contentStyles(theme) } : {}),
    ...(!!open ? { ...contentStylesOpen(theme) } : {}),
}));

const StyledGridWithTopMargin = styled(Grid)(({ theme }) => ({
    marginTop: '-12px',
    [theme.breakpoints.up('sm')]: {
        marginTop: '-24px',
    },
}));

export const NewViewRecord = ({
    account,
    author,
    isDeleted,
    isDeletedVersion,
    loadingRecordToView,
    recordToViewError,
    recordToView,
}) => {
    const history = useHistory();
    const txt = locale.pages.viewRecord;
    const dispatch = useDispatch();
    const { pid, version } = useParams();
    const isNotFoundRoute = !!pid && pid === notFound;
    const isAdmin = userIsAdmin();
    const isNtro = recordToView && !!general.NTRO_SUBTYPES.includes(recordToView.rek_subtype);
    const rekDisplayTypeLowercase = recordToView?.rek_display_type_lookup?.toLowerCase();
    const hideCitationText = doesListContainItem(PUBLICATION_EXCLUDE_CITATION_TEXT_LIST, rekDisplayTypeLowercase);
    const isAuthorOfNtroWork =
        isNtro &&
        !general.NTRO_RESEARCH_REPORT_SUBTYPES.includes(recordToView?.rek_subtype) &&
        belongsToAuthor(author, recordToView);

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
        let Component = null;
        const Problems =
            (recordToView &&
                shouldHandleAuthorAffiliations(recordToView) &&
                composeAuthorAffiliationProblems(recordToView)) ||
            /* istanbul ignore next */ [];
        if (recordToView?.fez_internal_notes?.ain_detail) {
            Component =
                Problems.length > 0 ? (
                    <ErrorOutlineOutlinedIcon
                        data-testid="error-affiliation-toggle-icon"
                        style={{ color: '#d32f2f' }}
                        fontSize="inherit"
                    />
                ) : (
                    <DescriptionOutlinedIcon fontSize="inherit" />
                );
        } else {
            Component =
                Problems.length > 0 ? (
                    <ErrorOutlineOutlinedIcon
                        style={{ color: '#d32f2f' }}
                        data-testid="error-affiliation-toggle-icon"
                        fontSize="inherit"
                        onClick={handleDrawerToggle}
                    />
                ) : (
                    <DescriptionOutlinedIcon fontSize="inherit" onClick={handleDrawerToggle} />
                );
        }
        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <Badge
                color="error"
                overlap="circular"
                badgeContent=""
                variant="dot"
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                invisible
            >
                {Component}
            </Badge>
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
                history,
                pid,
                shouldHandleAuthorAffiliations(recordToView),
                composeAuthorAffiliationProblems(
                    recordToView,
                    locale.pages.viewRecord.adminRecordData.drawer.nameIfAuthorUnavailable,
                ),
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(recordToView)],
    );

    if (!isNotFoundRoute && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (isNotFoundRoute || (recordToViewError && recordToViewError.status === 404)) {
        return (
            <StandardPage className="viewRecord" title={locale.pages.viewRecord.notFound.title}>
                <StyledGridWithTopMargin container id="notFoundGridContainer" data-testid="notFoundGridContainer">
                    <Grid xs={12}>{locale.pages.viewRecord.notFound.message}</Grid>
                </StyledGridWithTopMargin>
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
        <StyledContentWrapper open={open}>
            <StandardPage
                className="viewRecord"
                title={parseHtmlToJSX(recordToView.rek_title)}
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
                <StyledGridWithTopMargin container>
                    <Grid xs={12}>
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
                        <Grid xs={12}>
                            <Grid container spacing={2} style={{ marginBottom: 4 }}>
                                {isAdmin && !isDeleted && (
                                    <Grid>
                                        <Button
                                            variant="outlined"
                                            startIcon={getAdminRecordButtonIcon(recordToView)}
                                            onClick={handleDrawerToggle}
                                            id="adminDrawerButton"
                                            data-analyticsid="btnAdminToggleDrawerVisibility"
                                            data-testid="btnAdminToggleDrawerVisibility"
                                        >
                                            {`View ${
                                                recordToView?.fez_internal_notes?.ain_detail ? 'Notes \u0026' : ''
                                            } Record Data`}
                                        </Button>
                                    </Grid>
                                )}
                                <Grid xs sx={{ display: 'flex', alignItems: 'center' }}>
                                    {isAdmin && recordToView.rek_status !== general.PUBLISHED && (
                                        <Chip label={recordToView.rek_status_lookup} variant="outlined" />
                                    )}
                                </Grid>
                                <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SocialShare
                                        publication={recordToView}
                                        services={['email', 'print']}
                                        spaceBetween={4}
                                        round
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </StyledGridWithTopMargin>
                {isAdmin && (
                    <Grid xs={12} style={{ marginBottom: 24 }}>
                        <DetailedHistory record={recordToView} />
                    </Grid>
                )}
                {isDeleted && (
                    <Grid xs={12} style={{ marginBottom: 24 }}>
                        <Alert {...txt.deletedAlert} message={txt.deletedAlert.message(recordToView)} />
                    </Grid>
                )}
                {/* eslint-disable-next-line camelcase */}
                {!!version && !!recordToView?.rek_version && (
                    <Grid xs={12} style={{ marginBottom: 24 }}>
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
                                isAdmin={!!isAdmin}
                                isAuthor={isAuthorOfNtroWork}
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
        </StyledContentWrapper>
    );
};

NewViewRecord.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
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
