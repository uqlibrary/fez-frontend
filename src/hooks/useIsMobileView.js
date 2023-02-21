import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

export const useIsMobileView = () => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down('sm')) || false;
};

export const withIsMobileView = () => Component => props => {
    const isMobileView = useIsMobileView();
    return <Component isMobileView={isMobileView} {...props} />;
};
