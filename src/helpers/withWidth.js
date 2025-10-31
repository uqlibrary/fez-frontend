import React from 'react';
import { useWidth } from 'hooks';

/* istanbul ignore next */
export const withWidth = () => WrappedComponent => props => {
    const width = useWidth();
    return <WrappedComponent {...props} width={width} />;
};
