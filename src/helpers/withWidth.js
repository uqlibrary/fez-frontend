import React from 'react';
import { useWidth } from 'hooks';

/* c8 ignore next */
export const withWidth = () => WrappedComponent => props => {
    const width = useWidth();
    return <WrappedComponent {...props} width={width} />;
};
