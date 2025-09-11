import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import CircularProgress from '@mui/material/CircularProgress';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import DoneIcon from '@mui/icons-material/Done';

import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { locale as pagesLocale } from 'locale';
import { updateCurrentAuthor } from 'actions';
import * as actions from 'actions/actionTypes';
import DashboardOrcidSyncMessage from './DashboardOrcidSyncMessage';
import DashboardOrcidSyncPreferences from './DashboardOrcidSyncPreferences';
import { debounce } from 'throttle-debounce';
import { Settings } from '@mui/icons-material';

export const getOnSyncPreferenceChangeHandler = (
    author,
    accountAuthorSaving,
    setIsSyncEnabled,
    dispatch,
    hideDrawer,
) => {
    const updateSyncPreferences = debounce(3000, value => {
        dispatch(
            updateCurrentAuthor(author.aut_id, {
                ...author,
                aut_is_orcid_sync_enabled: value,
            }),
        );
    });

    return isChecked => {
        const value = isChecked ? 1 : 0;
        if (author.aut_is_orcid_sync_enabled === value || accountAuthorSaving) {
            return;
        }
        setIsSyncEnabled(isChecked);
        dispatch({ type: actions.CURRENT_AUTHOR_SAVING });
        hideDrawer();
        updateSyncPreferences(value);
    };
};

export const openUrl = url => () => window.open(url, '_blank');

const renderBadgeIcon = (status, defaultValue = undefined) => {
    switch (status) {
        case 'Pending':
        case 'In Progress':
            return () => <CircularProgress data-testid={'dashboard-orcid-sync-progress-icon'} size={20} />;
        case 'Error':
            return () => <SyncProblemIcon data-testid={'dashboard-orcid-sync-error-icon'} size={20} />;
        case 'Done':
        default:
            return defaultValue;
    }
};

const helpEmail = 'espace@library.uq.edu.au';

const getSyncStatus = (accountAuthorSaving, accountAuthorError, orcidSyncStatus, messageTemplate) => {
    const syncJobStatus = orcidSyncStatus?.orj_status;

    if (accountAuthorSaving) {
        return ['In Progress', messageTemplate.messages.syncPreference.saving];
    }
    if (accountAuthorError) {
        return ['Error', messageTemplate.messages.syncPreference.error];
    }

    let tooltipText;
    let detailedStatus;
    switch (syncJobStatus) {
        case 'Pending':
        case 'In Progress':
            tooltipText = messageTemplate.messages.inProgress;
            detailedStatus = messageTemplate.messages.inProgress;
            break;
        case 'Error':
            tooltipText = messageTemplate.messages.error;
            const statusParts = tooltipText.split(helpEmail);
            detailedStatus = (
                <React.Fragment>
                    {statusParts[0]} <a href={`mailto:${helpEmail}`}>{helpEmail}</a>
                    {statusParts[1]}
                </React.Fragment>
            );
            break;
        case 'Done':
        default:
            tooltipText = pagesLocale.pages.dashboard.header.dashboardOrcidSync.badgeTooltip;
            detailedStatus = messageTemplate.messages.done;
            break;
    }
    return [syncJobStatus, tooltipText, detailedStatus];
};

const getDrawerContents = (
    isSyncEnabled,
    onSyncPreferenceChange,
    accountAuthorSaving,
    messageTemplate,
    currentAuthorOrcidLink,
    disableRequest,
    lastSyncMessage,
    primaryClick,
    detailedStatus,
    syncJobStatus,
) => (
    <>
        <DashboardOrcidSyncPreferences
            onChange={onSyncPreferenceChange}
            checked={isSyncEnabled}
            disabled={accountAuthorSaving}
        />
        {isSyncEnabled && (
            <DashboardOrcidSyncMessage
                locale={messageTemplate}
                secondaryClick={openUrl(currentAuthorOrcidLink)}
                {...{
                    disableRequest,
                    lastSyncMessage,
                    primaryClick,
                    status: detailedStatus,
                    StatusIcon: renderBadgeIcon(syncJobStatus) || DoneIcon,
                    statusIconStyle: {
                        color:
                            (syncJobStatus === 'Done' && 'green') || (syncJobStatus === 'Error' && 'red') || undefined,
                    },
                }}
            />
        )}
    </>
);

export const DashboardOrcidSync = props => {
    const dispatch = useDispatch();
    const location = useLocation();
    const {
        author,
        accountAuthorSaving,
        accountAuthorError,
        hideDrawer,
        orcidSyncStatus,
        requestOrcidSync,
        requestingOrcidSync,
    } = props;
    const links = pagesLocale.pages.dashboard.header.dashboardResearcherIds.links;
    const currentAuthorOrcidLink = !!author.aut_orcid_id
        ? links.linkedUrl.orcid + author.aut_orcid_id
        : links.notLinkedUrl.orcid;
    const messageTemplate = pagesLocale.pages.dashboard.header.dashboardOrcidSync.helpDrawer;
    const [syncJobStatus, tooltipText, detailedStatus] = getSyncStatus(
        accountAuthorSaving,
        accountAuthorError,
        orcidSyncStatus,
        messageTemplate,
    );
    const lastSyncMessage =
        (author.aut_orcid_works_last_sync &&
            messageTemplate.messages.lastUpload.replace(
                '[syncTime]',
                moment(author.aut_orcid_works_last_sync).format('Do MMMM, YYYY [at] h:mma'),
            )) ||
        messageTemplate.messages.noPrevious;
    const isInProgress = ['Pending', 'In Progress'].indexOf(syncJobStatus) > -1;
    const disableRequest = requestingOrcidSync || isInProgress;
    const [isSyncEnabled, setIsSyncEnabled] = useState(!!author.aut_is_orcid_sync_enabled);

    useEffect(() => {
        setIsSyncEnabled(!!author.aut_is_orcid_sync_enabled);
    }, [author.aut_is_orcid_sync_enabled]);

    const onSyncPreferenceChange = getOnSyncPreferenceChangeHandler(
        author,
        accountAuthorSaving,
        setIsSyncEnabled,
        dispatch,
        hideDrawer,
    );

    const primaryClick = () => {
        requestOrcidSync();
        hideDrawer();
    };

    const helpIconProps = {
        IconComponent: renderBadgeIcon(syncJobStatus, () => <Settings size={20} />),
        iconSize: 'small',
        showLoader: requestingOrcidSync,
        style:
            ((accountAuthorSaving || isInProgress) && {
                marginLeft: '2px',
                marginBottom: '2px',
                cursor: 'default',
            }) ||
            {},
        text: getDrawerContents(
            isSyncEnabled,
            onSyncPreferenceChange,
            accountAuthorSaving,
            messageTemplate,
            currentAuthorOrcidLink,
            disableRequest,
            lastSyncMessage,
            primaryClick,
            detailedStatus,
            syncJobStatus,
        ),
        title: messageTemplate.title,
        tooltip: tooltipText,
        disabled: !!accountAuthorSaving,
    };
    return (
        <>
            {location?.state?.showOrcidLinkingConfirmation && (
                <ConfirmDialogBox
                    locale={{
                        confirmationTitle: pagesLocale.pages.orcidLink.successAlert.title,
                        confirmationMessage: pagesLocale.pages.orcidLink.successAlert.message,
                        confirmButtonLabel: 'OK',
                    }}
                    hideCancelButton
                    isOpen
                />
            )}
            <HelpIcon {...helpIconProps} testId="orcid" />
        </>
    );
};

DashboardOrcidSync.propTypes = {
    author: PropTypes.object,
    accountAuthorSaving: PropTypes.bool,
    accountAuthorError: PropTypes.bool,
    hideDrawer: PropTypes.func,
    orcidSyncStatus: PropTypes.object,
    requestOrcidSync: PropTypes.func,
    requestingOrcidSync: PropTypes.bool,
};

export default DashboardOrcidSync;
