import React from 'react';

import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

export const tableIcons = {
    Check: (props, ref) => <Check {...props} ref={ref} id="favourite-search-list-item-save" />,
    Clear: (props, ref) => <Clear {...props} ref={ref} id="favourite-search-list-item-cancel-save" />,
    Delete: (props, ref) => <Delete {...props} ref={ref} id="favourite-search-list-item-delete" />,
    Edit: (props, ref) => <Edit {...props} ref={ref} id="favourite-search-list-item-edit" />,
    SortArrow: (props, ref) => <ArrowDownward {...props} ref={ref} />,
};
