import * as React from 'react';

export interface InlineLoaderProps {
    message?: string;
    loaderId?: string;
    ariaLabel?: string;
}

export const InlineLoader: React.MemoExoticComponent<React.ComponentType<InlineLoaderProps>>;

declare const _default: React.MemoExoticComponent<React.ComponentType<InlineLoaderProps>>;
export default _default;
