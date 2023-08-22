import React from 'react';
import { LinkInfoTemplate } from './LinkInfoTemplate';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        item: {},
        ...testProps,
    };
    return rtlRender(<LinkInfoTemplate {...props} />);
}

describe('LinkInfoTemplate component', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
