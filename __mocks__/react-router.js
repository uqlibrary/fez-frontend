import React from 'react';

let currentPathname = '/';
let currentSearch = '';
let currentState = null;
let setCurrentLocation = null;

const parsePath = value => {
    if (!value) return { pathname: '/', search: '', state: null };
    if (typeof value === 'number') {
        return {
            pathname: currentPathname,
            search: currentSearch,
            state: currentState,
        };
    }

    const asString =
        typeof value === 'string'
            ? value
            : value.pathname || value.path || '/';
    const [pathname, search = ''] = asString.split('?');
    return {
        pathname: pathname || '/',
        search: search ? `?${search}` : '',
        state: typeof value === 'object' && value !== null ? (value.state ?? null) : null,
    };
};

const updateLocation = value => {
    const { pathname, search, state } = parsePath(value);
    currentPathname = pathname;
    currentSearch = search;
    currentState = state;
    if (setCurrentLocation) {
        setCurrentLocation({ pathname, search, state });
    }
};

const routeMatches = (routePath, pathname) => {
    if (!routePath || routePath === '*') return true;
    if (routePath === pathname) return true;
    if (routePath.endsWith('/*') && pathname.startsWith(routePath.slice(0, -1))) return true;

    const routeSegments = routePath.split('/').filter(Boolean);
    const pathSegments = pathname.split('/').filter(Boolean);

    if (routeSegments.length !== pathSegments.length) return false;

    return routeSegments.every((seg, idx) => seg.startsWith(':') || seg === pathSegments[idx]);
};

export const useNavigate = () => to => {
    updateLocation(to);
};
export const useLocation = () => ({ pathname: currentPathname, search: currentSearch, state: currentState });
export const useBlocker = () => ({
    state: 'unblocked',
    proceed: jest.fn(),
    reset: jest.fn(),
});
export const useParams = () => ({});
export const useHref = to => (typeof to === 'string' ? to : '');
export const useNavigationType = () => 'POP';
export const useSearchParams = () => [new URLSearchParams(), jest.fn()];
export const useResolvedPath = to => ({ pathname: typeof to === 'string' ? to : '' });

export const Route = ({ element, Component, children }) => {
    if (element) return element;
    if (Component) return <Component />;
    return <>{children}</>;
};
export const Routes = ({ children }) => {
    const items = React.Children.toArray(children);
    const match = items.find(item => routeMatches(item?.props?.path, currentPathname));
    return <>{match || null}</>;
};
export const Outlet = () => null;
export const MemoryRouter = ({ children, initialEntries = ['/'] }) => {
    const firstEntry = initialEntries[0] || '/';
    updateLocation(firstEntry);
    return <>{children}</>;
};
export const RouterProvider = ({ router, children }) => {
    if (!router || !Array.isArray(router.routes)) return <>{children ?? null}</>;

    const firstEntry = router.initialEntries?.[0] || '/';
    const [location, setLocation] = React.useState(() => {
        const parsed = parsePath(firstEntry);
        currentPathname = parsed.pathname;
        currentSearch = parsed.search;
        currentState = parsed.state;
        return parsed;
    });

    React.useEffect(() => {
        setCurrentLocation = setLocation;
        return () => {
            if (setCurrentLocation === setLocation) {
                setCurrentLocation = null;
            }
        };
    }, [setLocation]);

    const matched = router.routes.find(route => routeMatches(route?.path, location.pathname));
    if (!matched) return null;
    if (matched.element) return matched.element;
    if (matched.Component) return <matched.Component />;
    return null;
};
export const Link = ({ children, to = '#', ...props }) => (
    <a data-discover="true" href={typeof to === 'string' ? to : '#'} {...props}>
        {children}
    </a>
);

export const createRoutesFromChildren = () => [];
export const matchRoutes = () => null;
export const createMemoryRouter = (routes = [], options = {}) => ({
    routes,
    initialEntries: options.initialEntries || ['/'],
});
export const createBrowserRouter = (routes = [], options = {}) => ({
    routes,
    initialEntries: options.initialEntries || ['/'],
});
export const createHashRouter = (routes = [], options = {}) => ({
    routes,
    initialEntries: options.initialEntries || ['/'],
});
