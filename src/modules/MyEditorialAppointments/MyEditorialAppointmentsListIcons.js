import React from 'react';

import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

export const tableIcons = {
    Check: props => <Check {...props} />,
    Clear: props => <Clear {...props} />,
    Delete: props => <Delete {...props} />,
    Edit: props => <Edit {...props} />,
};
