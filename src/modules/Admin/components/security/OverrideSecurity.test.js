import React from 'react';
import OverrideSecurity from './OverrideSecurity';
import { rtlRender } from 'test-utils';

const setup = testProps => {
    const props = {
        label: 'test',
        overrideSecurityId: 'test',
        input: {
            onChange: jest.fn(),
        },
        ...testProps,
    };
    return rtlRender(<OverrideSecurity {...props} />);
};

describe('OverrideSecurity component', () => {
    it('should render properly', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
