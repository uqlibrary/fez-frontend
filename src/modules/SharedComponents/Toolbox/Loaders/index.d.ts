import * as React from 'react';

export interface InlineLoaderProps {
    message?: string;
    loaderId?: string;
    ariaLabel?: string;
}

// Named export
export declare const InlineLoader: React.MemoExoticComponent<React.ComponentType<InlineLoaderProps>>;

// Default export
declare const InlineLoaderDefault: React.MemoExoticComponent<React.ComponentType<InlineLoaderProps>>;
export default InlineLoaderDefault;
