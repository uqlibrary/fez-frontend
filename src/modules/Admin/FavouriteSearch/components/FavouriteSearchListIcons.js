import React, { forwardRef } from 'react';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

export const tableIcons = {
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} id="favourite-search-list-item-save" />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} id="favourite-search-list-item-cancel-save" />),
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} id="favourite-search-list-item-delete" />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} id="favourite-search-list-item-edit" />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};
