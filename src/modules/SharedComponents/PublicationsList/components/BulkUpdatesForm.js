import React from 'react';
import PropTypes from 'prop-types';

import { ChangeDisplayTypeForm } from './BulkUpdatesForms';
import { BUA_CHANGE_DISPLAY_TYPE } from 'config/general';

export const BulkUpdatesForm = React.forwardRef(({ selectedAction }, ref) => {
    switch (selectedAction) {
        case BUA_CHANGE_DISPLAY_TYPE:
            return <ChangeDisplayTypeForm ref={ref} />;
        default:
            return null;
    }
});

BulkUpdatesForm.propTypes = {
    selectedAction: PropTypes.string,
};

export default React.memo(BulkUpdatesForm);
