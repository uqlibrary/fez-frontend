import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

// MUI
import { mui1theme } from 'config';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

// Top level "pages"
import { App } from 'modules/App';
import { ScrollToTop } from 'modules/SharedComponents/Toolbox/ScrollToTop';

const router = createBrowserRouter([
    {
        path: '*',
        element: (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={mui1theme}>
                    <App>
                        <ScrollToTop>
                            <Outlet />
                        </ScrollToTop>
                    </App>
                </ThemeProvider>
            </StyledEngineProvider>
        ),
    },
]);

const Root = () => {
    return <RouterProvider router={router} />;
};

export default Root;
