import React from 'react';
import { InlineLoader } from './InlineLoader';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        classes: {
            text: {
                fontWeight: 200,
                margin: '24px 0',
            },
        },
    };
    return rtlRender(<InlineLoader {...props} />);
}

describe('Component InlineLoader', () => {
    it('should render as expected', () => {
        const props = {
            message: 'This is a tst',
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });
});
