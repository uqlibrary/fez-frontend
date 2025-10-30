import React, { forwardRef } from 'react';

import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Search from '@mui/icons-material/Search';
import GetApp from '@mui/icons-material/GetApp';

export const tableIcons = {
    Clear: forwardRef(/* c8 ignore next */ (props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    ResetSearch: forwardRef(/* c8 ignore next */ (props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    Download: forwardRef((props, ref) => <GetApp {...props} ref={ref} />),
};
