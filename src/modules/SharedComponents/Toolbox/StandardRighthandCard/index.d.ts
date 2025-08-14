import * as React from 'react';

export interface StandardRighthandCardHelp {
    title?: string;
    text?: React.ReactNode;
    buttonLabel?: string;
}

export interface StandardRighthandCardProps {
    children?: React.ReactNode;
    title?: string;
    testId?: string;
    help?: StandardRighthandCardHelp;
}

export const StandardRighthandCard: React.FC<StandardRighthandCardProps>;
export default StandardRighthandCard;
