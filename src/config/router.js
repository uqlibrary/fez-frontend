import { createBrowserRouter, createHashRouter } from 'react-router-dom';

export const createRouter =
    process.env.USE_MOCK ||
    process.env.BRANCH === 'production' ||
    process.env.BRANCH === 'staging' ||
    process.env.BRANCH === 'prodtest'
        ? createBrowserRouter
        : createHashRouter;
