import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
            debounce(
                300,
                event => {
                    navigateToUrl(
                        url,
                        event.ctrlKey || forceNewTab ? '_blank' : linkTarget,
                        !!action.isRecordEdit,
                        options,
                    );
                },
                { atBegin: true },
            );
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
                data-analyticsid={`admin-actions-button-${record}`}
                data-testid={`admin-actions-button-${record}`}
                aria-label="More"
                aria-haspopup="true"
                onClick={handleClick}
                size="large"
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
