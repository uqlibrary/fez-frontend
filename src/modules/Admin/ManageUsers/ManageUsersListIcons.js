import React, { forwardRef } from 'react';

import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Clear from '@mui/icons-material/Clear';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import Search from '@mui/icons-material/Search';

export const tableIcons = {
    Clear: forwardRef(/* istanbul ignore next */ (props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    SortArrow: forwardRef(/* istanbul ignore next */ (props, ref) => <ArrowDownward {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef(/* istanbul ignore next */ (props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef(/* istanbul ignore next */ (props, ref) => <Search {...props} ref={ref} />),
};
