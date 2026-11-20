import { useEffect, useRef } from 'react';

export const PAGE_HEADING_SELECTOR = '#page-title, h2';
const POLL_INTERVAL = 100;
const MAX_WAIT = 3000;

// The first h2 in the main region that isn't part of an alert: the page title on StandardPage pages.
export const findPageHeading = main =>
    Array.from(main.querySelectorAll(PAGE_HEADING_SELECTOR)).find(heading => !heading.closest('#espace-alerts-area')) ||
    null;

const focusElement = element => {
    if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '-1');
    }
    element.focus();
};

// Whether the user has pressed a key or clicked since the app loaded. Page changes before that are
// redirects during load (for example /records/add/results without a search), not something the user did,
// so focus stays at the start of the page where the skip link is.
const INTERACTION_EVENTS = ['keydown', 'pointerdown', 'click'];
let userHasInteracted = false;
let listening = false;
const markInteraction = () => {
    userHasInteracted = true;
};
const listenForInteraction = () => {
    if (listening) return;
    listening = true;
    INTERACTION_EVENTS.forEach(type => document.addEventListener(type, markInteraction, true));
};

/** Test helper: forget any earlier interaction and stop listening. */
export const resetUserInteraction = () => {
    userHasInteracted = false;
    listening = false;
    INTERACTION_EVENTS.forEach(type => document.removeEventListener(type, markInteraction, true));
};

/**
 * After an in-app page change, move focus to the new page's heading (or the main region) so screen
 * readers announce the page, as they would on a full page load (WCAG 2.4.3). It skips the first load,
 * changes to the query string only, redirects before the user has interacted (load-time redirects), and
 * pages that already moved focus into main themselves (for example an autofocused search field).
 *
 * @param {string} pathname the current location pathname
 * @param {string} mainId the id of the main region
 */
export const useFocusPageOnNavigate = (pathname, mainId) => {
    const previousPathname = useRef(pathname);

    useEffect(() => {
        listenForInteraction();
    }, []);

    useEffect(() => {
        if (previousPathname.current === pathname) {
            return undefined;
        }
        previousPathname.current = pathname;
        if (!userHasInteracted) {
            return undefined;
        }

        let waited = 0;
        let timer = null;
        const tryFocus = () => {
            const main = document.getElementById(mainId);
            /* istanbul ignore next */
            if (!main) return;
            const active = document.activeElement;
            if (active && active !== main && main.contains(active)) return;

            const heading = findPageHeading(main);
            if (heading || waited >= MAX_WAIT) {
                focusElement(heading || main);
                return;
            }
            waited += POLL_INTERVAL;
            timer = setTimeout(tryFocus, POLL_INTERVAL);
        };
        timer = setTimeout(tryFocus, 0);

        return () => clearTimeout(timer);
    }, [pathname, mainId]);
};

export default useFocusPageOnNavigate;
