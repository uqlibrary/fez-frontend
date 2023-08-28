import React from 'react';
import AudienceSizeField from './AudienceSizeField';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<AudienceSizeField {...props} />);
}

describe('AudienceSizeField component', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
