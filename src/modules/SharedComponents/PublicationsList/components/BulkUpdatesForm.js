import React from 'react';
import PropTypes from 'prop-types';

import { ChangeDisplayTypeForm, ChangeSearchKeyValueForm } from './BulkUpdatesForms';
import { BUA_CHANGE_DISPLAY_TYPE, BUA_CHANGE_SEARCHKEY_VALUE } from 'config/bulkUpdates';

export const BulkUpdatesForm = ({ selectedAction, recordsSelected, onCancel }) => {
    switch (selectedAction) {
        case BUA_CHANGE_DISPLAY_TYPE:
            return <ChangeDisplayTypeForm recordsSelected={recordsSelected} onCancel={onCancel} />;
        case BUA_CHANGE_SEARCHKEY_VALUE:
            return <ChangeSearchKeyValueForm recordsSelected={recordsSelected} onCancel={onCancel} />;
        // istanbul ignore next
        default:
            return null;
    }
};

BulkUpdatesForm.propTypes = {
    selectedAction: PropTypes.string,
    recordsSelected: PropTypes.object,
    onCancel: PropTypes.func,
};

export default React.memo(BulkUpdatesForm);
