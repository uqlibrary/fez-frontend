import ScrollToTop from './ScrollToTop';
import React from 'react';
import { fireEvent, render } from 'test-utils';

let mockUseLocation = { pathname: '/' };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => mockUseLocation,
}));

const setup = (location, renderer = render) => {
    !!location && (mockUseLocation = location);

    return renderer(
        <ScrollToTop>
            <div id="content-container" data-testid="content-container">
                tests
            </div>
        </ScrollToTop>,
    );
};

describe('ScrollToTop component', () => {
    it('should scroll to top on location change', () => {
        const yPosition = 100;
        const { getByTestId, rerender } = setup();

        fireEvent.scroll(getByTestId('content-container'), { target: { scrollTop: yPosition } });
        expect(getByTestId('content-container')).toHaveProperty('scrollTop', yPosition);

        setup({ pathname: '/test' }, rerender);
        expect(getByTestId('content-container')).toHaveProperty('scrollTop', 0);
    });

    it('should not scroll to top on location change when scrollToTop state flag is false', () => {
        const yPosition = 100;
        const { getByTestId, rerender } = setup();

        fireEvent.scroll(getByTestId('content-container'), { target: { scrollTop: yPosition } });
        expect(getByTestId('content-container')).toHaveProperty('scrollTop', yPosition);

        setup({ pathname: '/test', state: { scrollToTop: false } }, rerender);
        expect(getByTestId('content-container')).toHaveProperty('scrollTop', yPosition);
    });
});
