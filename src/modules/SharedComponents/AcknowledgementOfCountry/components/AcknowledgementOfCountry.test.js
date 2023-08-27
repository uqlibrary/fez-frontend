import React from 'react';
import AcknowledgementOfCountry from './AcknowledgementOfCountry';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = { ...testProps };
    return rtlRender(<AcknowledgementOfCountry {...props} />);
}

describe('Component AcknowledgementOfCountry', () => {
    it('should render component', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
