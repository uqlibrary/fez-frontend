import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { debounce } from 'throttle-debounce';

import { PUBLICATION_TYPES_WITH_DOI, RECORD_ACTION_URLS as defaultActions, RECORD_TYPE_RECORD } from 'config/general';
import { DOI_CROSSREF_PREFIX, DOI_DATACITE_PREFIX } from 'config/general';
import { rccDatasetCollection } from 'config/doi';

export const navigateToUrl = (uri, target, navigatedFrom, options) => {
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
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const pid = publication.rek_pid;
    const displayType = publication.rek_display_type;
    const recordType = (publication.rek_object_type_lookup && publication.rek_object_type_lookup.toLowerCase()) || '';
    const isTypeRecord = recordType === RECORD_TYPE_RECORD;
    const doi = !!publication.fez_record_search_key_doi && publication.fez_record_search_key_doi.rek_doi;
    const hasUQDoi = !!doi && (doi.indexOf(DOI_CROSSREF_PREFIX) === 0 || doi.indexOf(DOI_DATACITE_PREFIX) === 0);

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
        return !action.isChangeDisplayMenu || isTypeRecord;
    });

    // Restrict DOI option to restricted types
    const isDoiType = isTypeRecord && PUBLICATION_TYPES_WITH_DOI.includes(displayType);
    const isRccDataset = publication.fez_record_search_key_ismemberof?.filter(
        parent => parent.rek_ismemberof === rccDatasetCollection,
    ).length;

    filteredActions = filteredActions.filter(
        action => !action.isDoi || (isDoiType && (!doi || hasUQDoi) && !isRccDataset),
    );

    const menuOptions = filteredActions.map(action => {
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
    publication: PropTypes.object,
};

export default React.memo(AdminActions);
