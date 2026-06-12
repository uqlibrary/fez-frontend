import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { IS_PRODUCTION } from 'config/general';
import Typography from '@mui/material/Typography';

const TryCatch: React.FC<{ callback?: (error: Error) => unknown; children: React.ReactNode }> = ({
    callback,
    children,
}) => {
    return (
        <ErrorBoundary
            onError={error => {
                callback?.(error as Error);
                console.error(error);
            }}
            fallbackRender={({ error }) =>
                IS_PRODUCTION ? null : (
                    <Typography color="error">Failed to render component: {(error as Error)?.message}</Typography>
                )
            }
        >
            {children}
        </ErrorBoundary>
    );
};

export default React.memo(TryCatch);
