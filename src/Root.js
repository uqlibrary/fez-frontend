import React from 'react';
import { RouterProvider, Outlet } from 'react-router';
import { createRouter } from 'config/router';

// MUI
import { mui1theme } from 'config';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

// Top level "pages"
import { App } from 'modules/App';
import { ScrollToTop } from 'modules/SharedComponents/Toolbox/ScrollToTop';

const router = createRouter([
    {
        path: '*',
        element: (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={mui1theme}>
                    <ScrollToTop>
                        <App>
                            <Outlet />
                        </App>
                    </ScrollToTop>
                </ThemeProvider>
            </StyledEngineProvider>
        ),
    },
]);

const Root = () => {
    return <RouterProvider router={router} />;
};

export default Root;
