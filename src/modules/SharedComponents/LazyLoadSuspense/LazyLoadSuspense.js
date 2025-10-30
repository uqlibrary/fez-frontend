import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const LazyLoadSuspense = ({ children, fallback, minHeight = '200px' }) => {
    const defaultFallback = (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={minHeight} padding={2}>
            <CircularProgress size={40} />
        </Box>
    );

    return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
};

LazyLoadSuspense.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.node,
    minHeight: PropTypes.string,
};

export default LazyLoadSuspense;
