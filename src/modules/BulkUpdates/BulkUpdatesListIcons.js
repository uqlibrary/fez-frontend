import React, { forwardRef } from 'react';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Delete from '@material-ui/icons/Delete';

export const tableIcons = {
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} id="bulk-updates-list-item-delete" />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};
