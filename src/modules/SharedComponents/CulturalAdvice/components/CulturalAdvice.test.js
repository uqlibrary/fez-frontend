import React from 'react';
import CulturalAdvice from './CulturalAdvice';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = { ...testProps };
    return rtlRender(<CulturalAdvice {...props} />);
}

describe('Component CulturalAdvice', () => {
    it('should render component', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
