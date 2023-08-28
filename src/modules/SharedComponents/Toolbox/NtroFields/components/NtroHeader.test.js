import React from 'react';
import NtroHeader from './NtroHeader';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = {
        ...testProps,
    };
    return rtlRender(<NtroHeader {...props} />);
}

describe('Component NtroHeader', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
