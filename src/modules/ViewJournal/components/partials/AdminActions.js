import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { debounce } from 'throttle-debounce';
import { JOURNAL_ACTION_URLS as defaultActions } from 'config/general';
import { navigateToUrl } from 'modules/SharedComponents/Toolbox/helpers';

export const AdminActions = ({ adminActions = [...defaultActions], navigatedFrom = '', journal, ...rest }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const pid = journal.jnl_jid;

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
                    !!action.isRecordEdit && navigatedFrom,
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
                id="admin-actions-button"
                data-testid="admin-actions-button"
                data-analyticsid="admin-actions-button"
                aria-label="More"
                aria-haspopup="true"
                onClick={handleClick}
                size="large"
                {...rest}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                id="admin-actions-menu"
                data-testid="admin-actions-menu"
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
    navigatedFrom: PropTypes.string,
    journal: PropTypes.object,
};

export default React.memo(AdminActions);
