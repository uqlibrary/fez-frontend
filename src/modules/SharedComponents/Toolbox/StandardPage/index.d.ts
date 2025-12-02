import * as React from 'react';

export interface StandardPageProps {
    title?: React.ReactNode;
    help?: Record<string, unknown> | null;
    children?: React.ReactNode;
    standardPageId?: string;
}

declare const StandardPage: React.FC<StandardPageProps>;
export default StandardPage;
export { StandardPage };
