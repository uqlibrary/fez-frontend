import React from 'react';
import { render, waitFor, act, cleanup, userEvent } from 'test-utils';
import '@testing-library/jest-dom';
import AlmetricWidget, { externalDependenciesUrl, hidePopoverDelayInMs } from './AlmetricWidget';

const createFakeScript = src => {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script); // it won't actually fetch the given script. See jsdom setup.
    return script;
};

const triggerTestId = 'trigger';
const defaultProps = {
    id: 123,
    link: 'https://altmetric.com/details/123',
    title: 'link title',
};
const setup = (...props) =>
    render(
        <>
            <div data-testid="another-component">test</div>
            <AlmetricWidget {...defaultProps} {...props}>
                <div data-testid="trigger">Hover me</div>
            </AlmetricWidget>
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
        expect(getByTestId(triggerTestId)).toBeInTheDocument();
    });

    it('should display progressbar when widget has not yet been created', async () => {
        const { getByTestId, getByText, getByRole } = setup();
        await user.hover(getByTestId(triggerTestId));

        await waitFor(() => {
            expect(getByRole('progressbar')).toBeInTheDocument();
            expect(getByText(/publication’s Altmetric score/i)).toBeInTheDocument();
        });
    });

    describe('behavioural', () => {
        it('should open when mouse enters trigger and hide when it leaves', async () => {
            const { getByTestId } = setup();
            const trigger = getByTestId(triggerTestId);
            expect(getByTestId('altmetric-widget-popover')).not.toBeVisible();

            // open
            await user.hover(trigger);
            expect(getByTestId('altmetric-widget-popover')).toBeVisible();

            // move mouse away from trigger
            await user.hover(getByTestId('another-component'));
            act(() => {
                jest.advanceTimersByTime(hidePopoverDelayInMs);
            });
            expect(getByTestId('altmetric-widget-popover')).toBeVisible();
        });

        it('should close immediately esc keypress', async () => {
            const { getByTestId } = setup();
            const trigger = getByTestId(triggerTestId);
            expect(getByTestId('altmetric-widget-popover')).not.toBeVisible();

            // open it
            await user.hover(trigger);
            expect(getByTestId('altmetric-widget-popover')).toBeVisible();

            // close it
            await user.keyboard('[esc]');

            expect(getByTestId('altmetric-widget-popover').querySelector('.MuiBackdrop-root')).toHaveAttribute(
                'aria-hidden',
                'true',
            );
        });

        it('should keep it open when moving cursor over its contents and close when moving away', async () => {
            const { getByTestId } = setup();
            const trigger = getByTestId(triggerTestId);
            expect(getByTestId('altmetric-widget-popover')).not.toBeVisible();

            // open it
            await user.hover(trigger);
            expect(getByTestId('altmetric-widget-popover')).toBeVisible();

            // hover contents
            await user.hover(getByTestId('altmetric-widget-123'));
            act(() => {
                jest.advanceTimersByTime(hidePopoverDelayInMs);
            });

            expect(getByTestId('altmetric-widget-123')).toBeVisible();
            // move mouse away from contents
            await user.hover(getByTestId('another-component'));

            act(() => {
                jest.advanceTimersByTime(hidePopoverDelayInMs);
            });
            expect(getByTestId('altmetric-widget-123')).not.toBeVisible();
        });
    });

    describe('dependencies', () => {
        it('should inject external deps as script if already not done', async () => {
            expect(document.querySelector('script[src*="altmetric.com"]')).toBeNull();

            setup();

            await waitFor(() => {
                const script = document.querySelector(`script[src="${externalDependenciesUrl}"]`);
                expect(script).toBeInTheDocument();
                expect(script.async).toBe(true);
            });
        });

        it('should reuse existing create widget function', async () => {
            window._altmetric_embed_init = jest.fn();
            const existingScript = createFakeScript(externalDependenciesUrl);

            setup();

            await waitFor(() => {
                const scripts = document.querySelectorAll(`script[src="${externalDependenciesUrl}"]`);
                expect(scripts.length).toBe(1);
                expect(scripts[0]).toBe(existingScript);
            });
        });

        it('should call create widget function if available', async () => {
            window._altmetric_embed_init = jest.fn();
            setup();

            jest.runAllTimers();

            await waitFor(() => {
                expect(window._altmetric_embed_init).toHaveBeenCalledWith('#altmetric-widget-123');
            });
        });

        it('should remove non-core deps on unmount', async () => {
            const { unmount } = setup();
            const extraScript = createFakeScript('https://api.altmetric.com/bla/123');
            expect(extraScript).toBeInTheDocument();

            unmount();

            await waitFor(() => {
                expect(document.querySelector(`script[src*="widget/extra.js"]`)).not.toBeInTheDocument();
            });
            expect(extraScript).not.toBeInTheDocument();
        });
    });
});
