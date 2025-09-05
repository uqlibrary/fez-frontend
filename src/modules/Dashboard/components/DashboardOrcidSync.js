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

export const openUrl = url => () => window.open(url, '_blank');

const renderBadgeIcon = status => {
    switch (status) {
        case 'Pending':
        case 'In Progress':
            return () => <CircularProgress size={20} />;
        case 'Error':
            return () => <SyncProblemIcon size={20} />;
        case 'Done':
        default:
            return undefined;
    }
};

const helpEmail = 'espace@library.uq.edu.au';

const getSyncStatus = (accountAuthorSaving, accountAuthorError, orcidSyncStatus, messageTemplate) => {
    const jobStatus = orcidSyncStatus?.orj_status;

    /* istanbul ignore next */
    if (accountAuthorSaving) {
        return ['In Progress', messageTemplate.messages.syncPreference.saving];
    }
    /* istanbul ignore next */
    if (accountAuthorError) {
        return ['Error', messageTemplate.messages.syncPreference.error];
    }

    let tooltipText;
    let detailedStatus;
    switch (jobStatus) {
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
    return [jobStatus, tooltipText, detailedStatus];
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
    jobStatus,
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
                    StatusIcon: renderBadgeIcon(jobStatus) || DoneIcon,
                    statusIconStyle: {
                        color: (jobStatus === 'Done' && 'green') || (jobStatus === 'Error' && 'red') || undefined,
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
    const [jobStatus, tooltipText, detailedStatus] = getSyncStatus(
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
    const isInProgress = ['Pending', 'In Progress'].indexOf(jobStatus) > -1;
    const disableRequest = requestingOrcidSync || isInProgress;
    const [isSyncEnabled, setIsSyncEnabled] = useState(!!author.aut_is_orcid_sync_enabled);

    useEffect(() => {
        setIsSyncEnabled(!!author.aut_is_orcid_sync_enabled);
    }, [author.aut_is_orcid_sync_enabled]);

    /* istanbul ignore next */
    const onSyncPreferenceChange = isChecked => {
        const newValue = isChecked ? 1 : 0;
        if (author.aut_is_orcid_sync_enabled === newValue || accountAuthorSaving) {
            return;
        }
        setIsSyncEnabled(isChecked);

        dispatch({ type: actions.CURRENT_AUTHOR_SAVING });
        hideDrawer();
        setTimeout(
            () =>
                dispatch(
                    updateCurrentAuthor(author.aut_id, {
                        ...author,
                        aut_is_orcid_sync_enabled: newValue,
                    }),
                ),
            3000,
        );
    };

    const primaryClick = () => {
        requestOrcidSync();
        hideDrawer();
    };

    const helpIconProps = {
        IconComponent: renderBadgeIcon(jobStatus),
        iconSize: 'small',
        showLoader: requestingOrcidSync,
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
            jobStatus,
        ),
        title: messageTemplate.title,
        tooltip: tooltipText,
        disabled: !!accountAuthorSaving,
    };
    return (
        <>
            {
                /* istanbul ignore next */ location.state?.showOrcidLinkingConfirmation && (
                    <ConfirmDialogBox
                        locale={{
                            confirmationTitle: pagesLocale.pages.orcidLink.successAlert.title,
                            confirmationMessage: pagesLocale.pages.orcidLink.successAlert.message,
                            confirmButtonLabel: 'OK',
                        }}
                        hideCancelButton
                        isOpen
                    />
                )
            }
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
