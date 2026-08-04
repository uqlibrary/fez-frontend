import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import LocaleLink from './LocaleLink';

describe('LocaleLink', () => {
    let pushStateSpy;
    let popstateHandler;

    beforeEach(() => {
        pushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
        popstateHandler = jest.fn();
        window.addEventListener('popstate', popstateHandler);
    });

    afterEach(() => {
        pushStateSpy.mockRestore();
        window.removeEventListener('popstate', popstateHandler);
    });

    it('renders an anchor and navigates on a normal left click', () => {
        const { getByText } = render(<LocaleLink to="/next">Next</LocaleLink>);

        fireEvent.click(getByText('Next'));

        expect(getByText('Next')).toHaveAttribute('href', '/next');
        expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/next');
        expect(popstateHandler).toHaveBeenCalled();
    });

    it('calls onClick and prevents navigation when the event is cancelled', () => {
        const onClick = jest.fn(event => event.preventDefault());
        const { getByText } = render(
            <LocaleLink to="/next" onClick={onClick}>
                Next
            </LocaleLink>,
        );

        fireEvent.click(getByText('Next'));

        expect(onClick).toHaveBeenCalled();
        expect(pushStateSpy).not.toHaveBeenCalled();
    });

    it('does not navigate for non-primary clicks or modifier keys', () => {
        const { getByText } = render(<LocaleLink to="/next">Next</LocaleLink>);

        fireEvent.click(getByText('Next'), { button: 1 });
        fireEvent.click(getByText('Next'), { ctrlKey: true });

        expect(pushStateSpy).not.toHaveBeenCalled();
    });

    it('does not navigate when history pushState is unavailable', () => {
        const originalPushState = window.history.pushState;
        Object.defineProperty(window.history, 'pushState', {
            value: undefined,
            configurable: true,
        });

        const { getByText } = render(<LocaleLink to="/next">Next</LocaleLink>);
        fireEvent.click(getByText('Next'));

        expect(pushStateSpy).not.toHaveBeenCalled();

        Object.defineProperty(window.history, 'pushState', {
            value: originalPushState,
            configurable: true,
        });
    });
});
