import React from 'react';
import PropTypes from 'prop-types';

import { ChangeAuthorIdForm, ChangeDisplayTypeForm, ChangeSearchKeyValueForm } from './BulkUpdatesForms';
import { BUA_CHANGE_DISPLAY_TYPE, BUA_CHANGE_SEARCHKEY_VALUE, BUA_CHANGE_AUTHOR_ID } from 'config/bulkUpdates';

const BulkActionForms = {
    [BUA_CHANGE_AUTHOR_ID]: ChangeAuthorIdForm,
    [BUA_CHANGE_DISPLAY_TYPE]: ChangeDisplayTypeForm,
    [BUA_CHANGE_SEARCHKEY_VALUE]: ChangeSearchKeyValueForm,
};

export const BulkUpdatesForm = ({ selectedAction, recordsSelected, onCancel }) => {
    const BulkUpdateForm = BulkActionForms[selectedAction];
    return <BulkUpdateForm recordsSelected={recordsSelected} onCancel={onCancel} />;
};

BulkUpdatesForm.propTypes = {
    selectedAction: PropTypes.string,
    recordsSelected: PropTypes.object,
    onCancel: PropTypes.func,
};

export default React.memo(BulkUpdatesForm);
