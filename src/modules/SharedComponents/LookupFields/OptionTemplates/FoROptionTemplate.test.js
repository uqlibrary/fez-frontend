import React from 'react';
import FoROptionTemplate from './FoROptionTemplate';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<FoROptionTemplate {...props} />);
}
describe('FoROptionTemplate component', () => {
    it('should render FoR option correctly', () => {
        const { getByText } = setup({
            option: {
                value: 'Test option',
            },
        });

        expect(getByText('Test option')).toBeInTheDocument();
    });
});
