import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import {
    APP_URL,
    CHANGE_DISPLAY_MENU_ID,
    PATH_PREFIX,
    PUBLICATION_TYPES_WITH_DOI,
    RECORD_ACTION_URLS as defaultActions,
    STAGING_URL,
} from 'config/general';
import { DOI_ORG_PREFIX } from 'config/doi';

export const getLegacyEditUrl = (pid, type, urlPrefix) => {
    let wftID;
    let xdisID;
    let viewSlug;

    switch (type) {
        case 'community':
            wftID = 291;
            xdisID = 11;
            viewSlug = 'community';
            break;
        case 'collection':
            wftID = 290;
            xdisID = 9;
            viewSlug = 'collection';
            break;
        default:
            wftID = 289;
            xdisID = 179;
            viewSlug = 'view';
            break;
    }

    // Use staging URL for non-prod sites
    const prefix = urlPrefix.indexOf('https://espace.') === 0 ? urlPrefix : STAGING_URL;

    const href = encodeURIComponent(`/${viewSlug}/${pid}`);
    return `${prefix}workflow/update.php?pid=${pid}&cat=select_workflow&xdis_id=${xdisID}&wft_id=${wftID}&href=${href}`;
};

export const navigateToUrl = (uri, target, navigatedFrom, options) => () => {
    let fullUri = uri;
    if (navigatedFrom) {
        const queryStringGlue = uri.indexOf('?') > -1 ? '&' : '?';
        fullUri = `${uri}${queryStringGlue}navigatedFrom=${encodeURIComponent(navigatedFrom)}`;
    }
    window.open(fullUri, target, options);
};

export const AdminActions = ({
    adminActions = [...defaultActions],
    isRecordDeleted = false,
    navigatedFrom = '',
    publication,
    userHasNewAdminEdit = false,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const pid = publication.rek_pid;
    const displayType = publication.rek_display_type;
    const recordType = (publication.rek_object_type_lookup && publication.rek_object_type_lookup.toLowerCase()) || '';
    const doi = !!publication.fez_record_search_key_doi && publication.fez_record_search_key_doi.rek_doi;
    const hasUQDoi = !!doi && doi.indexOf(DOI_ORG_PREFIX) === 0;

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    /* istanbul ignore next */
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Remove actions which should not be shown for deleted records, if specified
    let filteredActions = isRecordDeleted ? adminActions.filter(action => action.showInDeleted) : adminActions;

    // 'change display type' only applies to Record types
    filteredActions = filteredActions.filter(action => {
        const isChangeDisplayMenuItem = (action.id || null) === CHANGE_DISPLAY_MENU_ID;
        const isTypeRecord = !['community', 'collection'].includes(recordType);
        return !isChangeDisplayMenuItem || isTypeRecord;
    });

    // Restrict DOI option to restricted types
    const isRecord = !['community', 'collection'].includes(recordType);
    const isDoiType = isRecord && PUBLICATION_TYPES_WITH_DOI.includes(displayType);
    filteredActions = filteredActions.filter(action => !action.isDoi || (isDoiType && (!doi || hasUQDoi)));

    const menuOptions = filteredActions.map(action => {
        const linkTarget = action.inApp ? '_self' : '_blank';
        const options = action.options || null;
        const url =
            !!action.isRecordEdit && !userHasNewAdminEdit
                ? getLegacyEditUrl(pid, recordType, `${APP_URL}${PATH_PREFIX}`)
                : action.url(pid);
        const clickHandler = navigateToUrl(
            url,
            linkTarget,
            !!action.isRecordEdit && userHasNewAdminEdit && navigatedFrom,
            options,
        );

        const label = action.isDoi ? action.label(!!doi) : action.label;
        return {
            label,
            clickHandler,
        };
    });
    return (
        <React.Fragment>
            <IconButton id="admin-actions-button" aria-label="More" aria-haspopup="true" onClick={handleClick}>
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu id="admin-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                {menuOptions.map((option, index) => (
                    <MenuItem key={index} onClick={option.clickHandler}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    );
};

AdminActions.propTypes = {
    adminActions: PropTypes.array,
    isRecordDeleted: PropTypes.bool,
    navigatedFrom: PropTypes.string,
    publication: PropTypes.object,
    userHasNewAdminEdit: PropTypes.bool,
};

export default React.memo(AdminActions);
