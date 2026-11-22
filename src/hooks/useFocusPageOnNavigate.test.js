import { fireEvent, renderHook } from '@testing-library/react';
import { useFocusPageOnNavigate, findPageHeading, resetUserInteraction } from './useFocusPageOnNavigate';

const setupDom = html => {
    document.body.innerHTML = `<nav><button id="menu-item">Menu item</button></nav><main id="main">${html}</main>`;
    document.getElementById('menu-item').focus();
};

// Renders the hook, then simulates the user pressing a key, as before any real page change they make.
const renderNav = (pathname = '/first', { interact = true } = {}) => {
    const result = renderHook(({ path }) => useFocusPageOnNavigate(path, 'main'), { initialProps: { path: pathname } });
    if (interact) fireEvent.keyDown(document.getElementById('menu-item'), { key: 'Enter' });
    return result;
};

describe('useFocusPageOnNavigate', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
        jest.useRealTimers();
        document.body.innerHTML = '';
        resetUserInteraction();
    });

    it('does not move focus for a redirect before the user has interacted', () => {
        setupDom('<h2 id="page-title">Redirected page</h2>');
        const { rerender } = renderNav('/records/add/results', { interact: false });
        rerender({ path: '/records/add/find' });
        jest.runAllTimers();
        expect(document.getElementById('menu-item')).toHaveFocus();
    });

    it.each(['click', 'pointerDown'])('treats a %s as user interaction', eventName => {
        setupDom('<h2 id="page-title">Second page</h2>');
        const { rerender } = renderNav('/first', { interact: false });
        fireEvent[eventName](document.getElementById('menu-item'));
        rerender({ path: '/second' });
        jest.runAllTimers();
        expect(document.getElementById('page-title')).toHaveFocus();
    });

    it('starts listening for interaction only once', () => {
        const addEventListener = jest.spyOn(document, 'addEventListener');
        setupDom('<h2 id="page-title">Page</h2>');
        renderNav('/first', { interact: false });
        renderNav('/other', { interact: false });
        expect(addEventListener.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(1);
        addEventListener.mockRestore();
    });

    it('does not move focus on the first render', () => {
        setupDom('<h2 id="page-title">First page</h2>');
        renderNav();
        jest.runAllTimers();
        expect(document.getElementById('menu-item')).toHaveFocus();
    });

    it('does not move focus when only the query string changes', () => {
        setupDom('<h2 id="page-title">First page</h2>');
        const { rerender } = renderNav();
        rerender({ path: '/first' });
        jest.runAllTimers();
        expect(document.getElementById('menu-item')).toHaveFocus();
    });

    it('focuses the page title after a page change', () => {
        setupDom('<div id="espace-alerts-area"><h2>Alert</h2></div><h2 id="page-title">Second page</h2>');
        const { rerender } = renderNav();
        rerender({ path: '/second' });
        jest.runAllTimers();
        const heading = document.getElementById('page-title');
        expect(heading).toHaveFocus();
        expect(heading).toHaveAttribute('tabindex', '-1');
    });

    it('keeps an existing tabindex on the heading', () => {
        setupDom('<h2 tabindex="0">Focusable heading</h2>');
        const { rerender } = renderNav();
        rerender({ path: '/second' });
        jest.runAllTimers();
        expect(document.querySelector('h2')).toHaveAttribute('tabindex', '0');
        expect(document.querySelector('h2')).toHaveFocus();
    });

    it('waits for the heading of a page that is still loading', () => {
        setupDom('<p>Loading</p>');
        const { rerender } = renderNav();
        rerender({ path: '/second' });
        jest.advanceTimersByTime(300);
        expect(document.getElementById('menu-item')).toHaveFocus();

        document.getElementById('main').innerHTML = '<h2>Loaded page</h2>';
        jest.advanceTimersByTime(100);
        expect(document.querySelector('h2')).toHaveFocus();
    });

    it('falls back to the main region when the page has no heading', () => {
        setupDom('<p>No heading</p>');
        const { rerender } = renderNav();
        rerender({ path: '/second' });
        jest.runAllTimers();
        expect(document.getElementById('main')).toHaveFocus();
    });

    it('leaves focus alone when the page has already focused something in main', () => {
        setupDom('<h2 id="page-title">Search</h2><input id="search-field" />');
        const { rerender } = renderNav();
        document.getElementById('search-field').focus();
        rerender({ path: '/second' });
        jest.runAllTimers();
        expect(document.getElementById('search-field')).toHaveFocus();
    });

    it('stops waiting when the component unmounts', () => {
        setupDom('<p>Loading</p>');
        const { rerender, unmount } = renderNav();
        rerender({ path: '/second' });
        unmount();
        jest.runAllTimers();
        expect(document.getElementById('menu-item')).toHaveFocus();
    });

    it('finds no heading when only alerts have headings', () => {
        setupDom('<div id="espace-alerts-area"><h2>Alert</h2></div>');
        expect(findPageHeading(document.getElementById('main'))).toBeNull();
    });
});
