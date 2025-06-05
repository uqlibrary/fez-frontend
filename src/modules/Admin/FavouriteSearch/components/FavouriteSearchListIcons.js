import React, { forwardRef } from 'react';

import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

export const tableIcons = {
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} id="favourite-search-list-item-save" />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} id="favourite-search-list-item-cancel-save" />),
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} id="favourite-search-list-item-delete" />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} id="favourite-search-list-item-edit" />),
};
