import React, { forwardRef } from 'react';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Search from '@mui/icons-material/Search';
import GetApp from '@mui/icons-material/GetApp';

export const tableIcons = {
    Clear: forwardRef(/* istanbul ignore next */ (props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    ResetSearch: forwardRef(/* istanbul ignore next */ (props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    Download: forwardRef((props, ref) => <GetApp {...props} ref={ref} />),
    FirstPage: forwardRef(/* istanbul ignore next */ (props, ref) => <FirstPageIcon {...props} ref={ref} />),
    LastPage: forwardRef(/* istanbul ignore next */ (props, ref) => <LastPageIcon {...props} ref={ref} />),
    ChevronLeft: forwardRef(/* istanbul ignore next */ (props, ref) => <ChevronLeftIcon {...props} ref={ref} />),
    ChevronRight: forwardRef(/* istanbul ignore next */ (props, ref) => <ChevronRightIcon {...props} ref={ref} />),
};
