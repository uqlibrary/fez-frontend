import React from 'react';
import { render, waitFor, act, cleanup, userEvent } from 'test-utils';
import '@testing-library/jest-dom';
import AlmetricWidget from './AlmetricWidget';
import { fireEvent } from '@testing-library/react';

// jest.mock('throttle-debounce', () => ({
//     debounce: (delay, fn) => {
//         const debounced = (...args) => {
//             // call the real function immediately for testing
//             fn(...args);
//         };
//         debounced.cancel = jest.fn(); // still allow cancel to be called
//         return debounced;
//     },
// }));

const createFakeScript = src => {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script); // it won't actually fetch the given script. See jsdom setup.
    return script;
};

const childrenContainerId = 'children-container';
const defaultProps = {
    id: 123,
    link: 'https://altmetric.com/details/123',
    title: 'link title',
    children: <span data-testid={childrenContainerId}>Hover me</span>,
};
const setup = (...props) =>
    render(
        <>
            <div data-testid="another-component">test</div>
            <div data-testid="container">
                <AlmetricWidget {...defaultProps} {...props} />
            </div>
        </>,
    );

describe('AlmetricWidget', () => {
    let user;

    beforeEach(() => {
        jest.clearAllMocks();
        cleanup();
        document.body.innerHTML = '';
        delete window._altmetric_embed_init;
        jest.useFakeTimers();
        user = userEvent.setup({ delay: null });
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should wrap given elements', () => {
        const { getByTestId } = setup();
        expect(getByTestId(childrenContainerId)).toBeInTheDocument();
    });

    it('should open popover on mouse enter and shows loading content', async () => {
        const { getByTestId, getByText, getByRole } = setup();
        await user.hover(getByTestId(childrenContainerId));

        await waitFor(() => {
            expect(getByText(/loading breakdown/i)).toBeInTheDocument();
            expect(getByRole('link', { name: defaultProps.title })).toBeInTheDocument();
        });
    });

    // it('should call hidePopover after mouse leaves', async () => {
    //     const { getByTestId, findByText } = setup();
    //     const element = getByTestId(childrenContainerId);
    //
    //     // Hover to show popover
    //     await user.hover(element);
    //     await user.unhover(element);
    //
    //     // // // Mouse leave triggers hidePopover (debounced)
    //     act(() => {
    //         // fireEvent.mouseLeave(popoverDiv);
    //         jest.advanceTimersByTime(600);
    //     });
    // });
    //
    // it('should cancel scheduled hidePopover when mouse enters popover again', async () => {
    //     const { getByTestId, findByRole } = setup();
    //     const element = getByTestId(childrenContainerId);
    //
    //     const debounceMock = require('throttle-debounce').debounce;
    //     const debouncedFn = debounceMock.mock.results[0].value;
    //
    //     // Hover to open popover
    //     await user.hover(element);
    //
    //     // Find inner popover link
    //     const innerLink = await findByRole('link', { name: defaultProps.title });
    //
    //     // Hover inside popover should cancel the scheduled hidePopover
    //     await user.hover(innerLink);
    //
    //     expect(debouncedFn.cancel).toHaveBeenCalledWith({ upcomingOnly: true });
    // });

    it('should inject external deps as script if already not done', async () => {
        expect(document.querySelector('script[src*="altmetric.com"]')).toBeNull();

        setup();

        await waitFor(() => {
            const script = document.querySelector('script[src="https://embed.altmetric.com/assets/embed.js"]');
            expect(script).toBeInTheDocument();
            expect(script.async).toBe(true);
        });
    });

    it('should reuse existing create widget function', async () => {
        window._altmetric_embed_init = jest.fn();
        const existingScript = createFakeScript('https://embed.altmetric.com/assets/embed.js');

        setup();

        await waitFor(() => {
            const scripts = document.querySelectorAll('script[src="https://embed.altmetric.com/assets/embed.js"]');
            expect(scripts.length).toBe(1);
            expect(scripts[0]).toBe(existingScript);
        });
    });

    it('should call create widget function if available', async () => {
        window._altmetric_embed_init = jest.fn();
        setup();

        jest.runAllTimers();

        await waitFor(() => {
            expect(window._altmetric_embed_init).toHaveBeenCalledWith('#altmetric-badge-123');
        });
    });

    it('should remove non-core external deps on unmount', async () => {
        const { unmount } = setup();
        const extraScript = createFakeScript('https://altmetric.com/widget/extra.js');
        expect(extraScript).toBeInTheDocument();

        unmount();

        await waitFor(() => {
            expect(document.querySelector(`script[src*="widget/extra.js"]`)).not.toBeInTheDocument();
        });
    });

    it('should display loading/fall-back strategy', async () => {
        const { getByTestId, getByText, getByRole } = setup();
        await user.hover(getByTestId(childrenContainerId));

        await waitFor(() => {
            expect(getByRole('progressbar')).toBeInTheDocument();
            expect(getByText(/publication’s Altmetric score/i)).toBeInTheDocument();
        });
    });
});
