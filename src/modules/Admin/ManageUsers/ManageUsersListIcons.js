import React, { forwardRef } from 'react';

import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Search from '@mui/icons-material/Search';

export const tableIcons = {
    Clear: forwardRef(/* c8 ignore next */ (props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    SortArrow: forwardRef(/* c8 ignore next */ (props, ref) => <ArrowDownward {...props} ref={ref} />),
    ResetSearch: forwardRef(/* c8 ignore next */ (props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef(/* c8 ignore next */ (props, ref) => <Search {...props} ref={ref} />),
};
