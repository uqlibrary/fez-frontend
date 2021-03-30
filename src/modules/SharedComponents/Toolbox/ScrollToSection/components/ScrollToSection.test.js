import React from 'react';
import { rtlRender } from 'test-utils';
import ScrollToSection from './ScrollToSection';

describe('ScrollToSection', () => {
    it('should scroll to section', () => {
        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

        const { asFragment } = rtlRender(
            <ScrollToSection scrollToSection>
                <span>It should be wrapped by div tag</span>
            </ScrollToSection>,
        );

        expect(scrollIntoViewMock).toBeCalled();
        expect(asFragment()).toMatchSnapshot();
    });

    it('should not scroll to section', () => {
        const { asFragment } = rtlRender(
            <ScrollToSection>
                <span>It should not be wrapped by div tag</span>
            </ScrollToSection>,
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
