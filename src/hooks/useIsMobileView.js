import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';

export const useIsMobileView = () => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down('xs')) || false;
};

export const withIsMobileView = () => Component => props => {
    const isMobileView = useIsMobileView();
    return <Component isMobileView={isMobileView} {...props} />;
};
