import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { debounce } from 'throttle-debounce';
import { PATH_PREFIX, APP_URL } from 'config';

export const navigateToUrl = (uri, target, navigatedFrom, options) => {
    const fullUri = uri;
    window.open(fullUri, target, options);
};

export const AdminActions = ({
    adminActions = [
        {
            label: 'Edit selected record',
            url: pid => `${APP_URL}${PATH_PREFIX}admin/edit/${pid}`,
            inApp: true,
            showInDeleted: true,
            options: null,
            isRecordEdit: true,
        },
        {
            label: 'Change security for record',
            url: pid => `${APP_URL}${PATH_PREFIX}admin/edit/${pid}?tab=security`,
            inApp: true,
            showInDeleted: true,
            options: null,
            isRecordEdit: true,
        },
        {
            label: 'More options',
            url: pid => `https://espace.library.uq.edu.au/workflow/list_workflows2.php?pid=${pid}&href=%2Fbrowse`,
            inApp: false,
            showInDeleted: true,
            options: null,
            isRecordEdit: false,
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
            <IconButton
                id={`admin-actions-button-${record}`}
                data-testid={`admin-actions-button-${record}`}
                aria-label="More"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                id={`admin-actions-menu-${record}`}
                data-testid={`admin-actions-menu-${record}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
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
