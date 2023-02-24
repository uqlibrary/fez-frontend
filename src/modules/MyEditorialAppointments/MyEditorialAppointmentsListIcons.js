import React, { forwardRef } from 'react';

// import AddCircle from '@mui/icons-material/AddCircle';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

export const tableIcons = {
    // Add: forwardRef((props, ref) => <AddCircle {...props} color="primary" fontSize="large" ref={ref} />),
    Check: forwardRef(/* istanbul ignore next */ (props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef(/* istanbul ignore next */ (props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};
