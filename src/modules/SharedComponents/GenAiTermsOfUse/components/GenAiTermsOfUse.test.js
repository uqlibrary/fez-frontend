import React from 'react';
import GenAiTermsOfUse from './GenAiTermsOfUse';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = { ...testProps };
    return rtlRender(<GenAiTermsOfUse {...props} />);
}

describe('Component GenAiTermsOfUse', () => {
    it('should render component', () => {
        const { getByText } = setup({});
        expect(getByText('Restrictions on Use')).toBeInTheDocument();
    });
});
