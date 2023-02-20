import React, { forwardRef } from 'react';

import ArrowDownward from '@mui/icons-material/ArrowDownward';

export const tableIcons = {
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};
