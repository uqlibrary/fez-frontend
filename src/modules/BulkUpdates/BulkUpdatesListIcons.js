import React, { forwardRef } from 'react';

import ArrowDownward from '@material-ui/icons/ArrowDownward';

export const tableIcons = {
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};
