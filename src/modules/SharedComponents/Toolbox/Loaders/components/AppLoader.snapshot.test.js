import React from 'react';
import { AppLoader } from './AppLoader';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };
    return rtlRender(<AppLoader {...props} />);
}

describe('Component AppLoader', () => {
    it('should render as expected', () => {
        // set initial props values
        const props = {
            title: 'Fez frontend',
            logoImage: 'http://image/image.svg',
            logoText: 'Fez logo',
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });
});
