import React from 'react';

// import AddCircle from '@mui/icons-material/AddCircle';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

export const tableIcons = {
    Check: props => <Check {...props} />,
    Clear: props => <Clear {...props} />,
    Delete: props => <Delete {...props} />,
    Edit: props => <Edit {...props} />,
    SortArrow: props => <ArrowDownward {...props} />,
};
