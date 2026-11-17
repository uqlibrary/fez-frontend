import { renderHook } from '@testing-library/react';
import { useFocusPageOnNavigate, findPageHeading } from './useFocusPageOnNavigate';

const setupDom = html => {
    document.body.innerHTML = `<nav><button id="menu-item">Menu item</button></nav><main id="main">${html}</main>`;
    document.getElementById('menu-item').focus();
};

const renderNav = (pathname = '/first') =>
    renderHook(({ path }) => useFocusPageOnNavigate(path, 'main'), { initialProps: { path: pathname } });

describe('useFocusPageOnNavigate', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
        jest.useRealTimers();
        document.body.innerHTML = '';
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
