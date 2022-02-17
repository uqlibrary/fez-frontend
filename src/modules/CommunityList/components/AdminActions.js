import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { debounce } from 'throttle-debounce';

export const navigateToUrl = (uri, target, navigatedFrom, options) => {
    let fullUri = uri;
    if (navigatedFrom) {
        const queryStringGlue = uri.indexOf('?') > -1 ? '&' : '?';
        fullUri = `${uri}${queryStringGlue}navigatedFrom=${encodeURIComponent(navigatedFrom)}`;
    }
    window.open(fullUri, target, options);
};

export const AdminActions = ({
    adminActions = [
        {
            label: 'Edit selected record',
            url: pid => `#/admin/edit/${pid}`,
            inApp: true,
            showInDeleted: true,
            options: null,
            isRecordEdit: true,
        },
        {
            label: 'Change security for record',
            url: pid => `#/admin/edit/${pid}`,
            inApp: true,
            showInDeleted: true,
            options: null,
            isRecordEdit: true,
        },
        {
            label: 'More options',
            url: pid => `#${pid}`,
            inApp: true,
            showInDeleted: true,
            options: null,
            isRecordEdit: true,
        },
    ],
    record,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const pid = record;

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    /* istanbul ignore next */
    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuOptions = adminActions.map(action => {
        const linkTarget = action.inApp ? '_self' : '_blank';
        const options = action.options || null;
        const url = action.url(pid);
        const clickHandler = (forceNewTab = false) =>
            debounce(300, true, event => {
                navigateToUrl(
                    url,
                    event.ctrlKey || forceNewTab ? '_blank' : linkTarget,
                    !!action.isRecordEdit,
                    options,
                );
            });
        const label = action.label;
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
                    <MenuItem
                        key={index}
                        onClick={option.clickHandler()}
                        onContextMenu={option.clickHandler(true)}
                        onAuxClick={option.clickHandler(true)}
                    >
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
    record: PropTypes.string,
};

export default React.memo(AdminActions);
