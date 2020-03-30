import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { RECORD_ACTION_URLS as defaultActions, APP_URL, STAGING_URL, PATH_PREFIX } from 'config/general';

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

export const navigateToUrl = (uri, target, navigatedFrom = '') => () => {
    let fullUri = uri;
    if (navigatedFrom) {
        const queryStringGlue = uri.indexOf('?') > -1 ? '&' : '?';
        fullUri = `${uri}${queryStringGlue}navigatedFrom=${encodeURIComponent(navigatedFrom)}`;
    }
    window.open(fullUri, target);
};

export const AdminActions = ({
    pid,
    navigatedFrom,
    userHasNewAdminEdit = false,
    recordType,
    adminActions = [...defaultActions],
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    /* istanbul ignore next */
    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuOptions = adminActions.map((action, index) => {
        const linkTarget = action.inApp ? '_self' : '_blank';
        const isEditUrl = index === 0;
        const url =
            userHasNewAdminEdit && isEditUrl
                ? action.url(pid)
                : getLegacyEditUrl(pid, recordType, `${APP_URL}${PATH_PREFIX}`);
        const clickHandler = navigateToUrl(url, linkTarget, isEditUrl && navigatedFrom);
        return {
            label: action.label,
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
    pid: PropTypes.string,
    navigatedFrom: PropTypes.string,
    adminActions: PropTypes.array,
    userHasNewAdminEdit: PropTypes.bool,
    recordType: PropTypes.string,
};

export default React.memo(AdminActions);
