import React, { forwardRef } from 'react';
import Search from '@mui/icons-material/Search';
import SearchOff from '@mui/icons-material/SearchOff';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const tableIcons = {
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SearchOff: forwardRef((props, ref) => <SearchOff {...props} ref={ref} />),
    ChevronLeft: forwardRef(/* istanbul ignore next */ (props, ref) => <ChevronLeftIcon {...props} ref={ref} />),
    ChevronRight: forwardRef(/* istanbul ignore next */ (props, ref) => <ChevronRightIcon {...props} ref={ref} />),
};
