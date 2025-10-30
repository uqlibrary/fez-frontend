import React from 'react';
import { useTheme } from '@mui/material/styles';

/* c8 ignore next */
export const withTheme = () => WrappedComponent => props => {
    const theme = useTheme();
    return <WrappedComponent {...props} theme={theme} />;
};
