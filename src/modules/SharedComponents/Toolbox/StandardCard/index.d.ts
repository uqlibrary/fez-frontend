import * as React from 'react';

export interface StandardCardProps {
    accentHeader?: boolean;
    children?: React.ReactNode;
    customBackgroundColor?: unknown;
    customTitleBgColor?: unknown;
    customTitleColor?: unknown;
    fullHeight?: boolean;
    help?: Record<string, unknown> | null;
    noHeader?: boolean;
    noPadding?: boolean;
    primaryHeader?: boolean;
    smallTitle?: boolean;
    squareTop?: boolean;
    standardCardId?: string;
    subCard?: boolean;
    title?: React.ReactNode;
}

export const StandardCard: React.FC<StandardCardProps>;
export default StandardCard;
