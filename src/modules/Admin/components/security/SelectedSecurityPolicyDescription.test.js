import React from 'react';
import SelectedSecurityPolicyDescription from './SelectedSecurityPolicyDescription';
import { rtlRender } from 'test-utils';

const setup = testProps => {
    const props = {
        title: 'test',
        ...testProps,
    };
    return rtlRender(<SelectedSecurityPolicyDescription {...props} />);
};

describe('SelectedSecurityPolicyDescription component', () => {
    it('should render properly', () => {
        const { container } = setup({
            selectedPolicyKey: 2,
        });
        expect(container).toMatchSnapshot();
    });
});
