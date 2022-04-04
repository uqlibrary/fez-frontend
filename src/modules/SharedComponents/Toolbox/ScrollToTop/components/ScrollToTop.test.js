import * as Component from './ScrollToTop';
import React from 'react';
import { fireEvent, render } from 'test-utils';

jest.mock('react-router-dom');

const getComponent = (location = { pathname: '/' }) => (
    <Component.ScrollToTop
        {...{
            location,
            children: (
                <div id="content-container" data-testid="content-container">
                    tests
                </div>
            ),
        }}
    />
);
const setup = location => {
    return render(getComponent(location));
};

describe('ScrollToTop component', () => {
    it('should scroll to top on location change', () => {
        const yPosition = 100;
        const wrapper = setup();

        fireEvent.scroll(wrapper.getByTestId('content-container'), { target: { scrollTop: yPosition } });
        expect(wrapper.getByTestId('content-container')).toHaveProperty('scrollTop', yPosition);

        wrapper.rerender(getComponent({ pathname: '/test' }));
        expect(wrapper.getByTestId('content-container')).toHaveProperty('scrollTop', 0);
    });

    it('should not scroll to top on location change when scrollToTop state flag is false', () => {
        const yPosition = 100;
        const wrapper = setup();

        fireEvent.scroll(wrapper.getByTestId('content-container'), { target: { scrollTop: yPosition } });
        expect(wrapper.getByTestId('content-container')).toHaveProperty('scrollTop', yPosition);

        wrapper.rerender(getComponent({ pathname: '/test', state: { scrollToTop: false } }));
        expect(wrapper.getByTestId('content-container')).toHaveProperty('scrollTop', yPosition);
    });
});
