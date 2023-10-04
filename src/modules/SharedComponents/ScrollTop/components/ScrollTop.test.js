import React from 'react';
import { ScrollTop as ScrollTopClass } from './ScrollTop';
import ScrollTop from './ScrollTop';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = {
        classes: {},
        ...testProps,
    };
    return rtlRender(<ScrollTopClass {...props} />);
}

describe('Component ScrollTop', () => {
    it('should render component', () => {
        const { container } = setup({ show: true });
        expect(container).toMatchSnapshot();
    });

    it('should not render component', () => {
        const { container } = setup({ show: false });
        expect(container).toMatchSnapshot();
    });
});

function setupFull(testProps) {
    const props = {
        classes: {},
        ...testProps,
    };
    return rtlRender(<ScrollTop {...props} />);
}

describe('Component ScrollTop', () => {
    it('should render component', () => {
        const { container } = setupFull({ show: true });
        expect(container).toMatchSnapshot();
    });

    it('should not render component', () => {
        const { container } = setupFull({ show: false });
        expect(container).toMatchSnapshot();
    });
});
