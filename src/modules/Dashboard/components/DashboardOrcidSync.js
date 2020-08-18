import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import CircularProgress from '@material-ui/core/CircularProgress';
import SyncProblemIcon from '@material-ui/icons/SyncProblem';
import DoneIcon from '@material-ui/icons/Done';

import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import DashboardOrcidSyncMessage from './DashboardOrcidSyncMessage';

import { locale as pagesLocale } from 'locale';

export const openUrl = url => () => window.open(url, '_blank');

const renderBadgeIcon = status => {
    switch (status) {
        case 'Pending':
        case 'In Progress':
            return CircularProgress;
        case 'Error':
            return SyncProblemIcon;
        case 'Done':
        default:
            return undefined;
    }
};

const helpEmail = 'espace@library.uq.edu.au';

export const DashboardOrcidSync = props => {
    const { author, hideDrawer, orcidSyncStatus, requestOrcidSync, requestingOrcidSync } = props;
    const links = pagesLocale.pages.dashboard.header.dashboardResearcherIds.links;
    const currentAuthorOrcidLink = !!author.aut_orcid_id
        ? links.linkedUrl.orcid + author.aut_orcid_id
        : links.notLinkedUrl.orcid;
    const messageTemplate = pagesLocale.pages.dashboard.header.dashboardOrcidSync.helpDrawer;
    let status;
    let detailedStatus;
    const orjStatus = orcidSyncStatus && orcidSyncStatus.orj_status;
    switch (orjStatus) {
        case 'Pending':
        case 'In Progress':
            status = messageTemplate.messages.inProgress;
            detailedStatus = messageTemplate.messages.inProgress;
            break;
        case 'Error':
            status = messageTemplate.messages.error;
            const statusParts = status.split(helpEmail);
            detailedStatus = (
                <React.Fragment>
                    {statusParts[0]} <a href={`mailto:${helpEmail}`}>{helpEmail}</a>
                    {statusParts[1]}
                </React.Fragment>
            );
            break;
        case 'Done':
        default:
            status = pagesLocale.pages.dashboard.header.dashboardOrcidSync.badgeTooltip;
            detailedStatus = messageTemplate.messages.done;
            break;
    }
    const lastSyncMessage =
        (author.aut_orcid_works_last_sync &&
            messageTemplate.messages.lastUpload.replace(
                '[syncTime]',
                moment(author.aut_orcid_works_last_sync).format('Do MMMM, YYYY [at] h:mma'),
            )) ||
        messageTemplate.messages.noPrevious;

    const isInProgress = ['Pending', 'In Progress'].indexOf(orjStatus) > -1;
    const disableRequest = requestingOrcidSync || isInProgress;
    const primaryClick = () => {
        requestOrcidSync();
        hideDrawer();
    };

    const message = (
        <DashboardOrcidSyncMessage
            locale={messageTemplate}
            secondaryClick={openUrl(currentAuthorOrcidLink)}
            {...{
                disableRequest,
                lastSyncMessage,
                primaryClick,
                status: detailedStatus,
                StatusIcon: renderBadgeIcon(orjStatus) || DoneIcon,
                statusIconStyle: {
                    color: (orjStatus === 'Done' && 'green') || (orjStatus === 'Error' && 'red') || undefined,
                },
            }}
        />
    );

    const helpIconProps = {
        IconComponent: renderBadgeIcon(orjStatus),
        iconSize: 20,
        showLoader: requestingOrcidSync,
        style:
            (isInProgress && {
                marginLeft: '2px',
                marginBottom: '2px',
            }) ||
            {},
        text: message,
        title: messageTemplate.title,
        tooltip: status,
    };
    return <HelpIcon {...helpIconProps} testId="orcid-help-icon" />;
};

DashboardOrcidSync.propTypes = {
    author: PropTypes.object,
    classes: PropTypes.object,
    hideDrawer: PropTypes.func,
    orcidSyncStatus: PropTypes.object,
    requestOrcidSync: PropTypes.func,
    requestingOrcidSync: PropTypes.bool,
};

export default DashboardOrcidSync;
