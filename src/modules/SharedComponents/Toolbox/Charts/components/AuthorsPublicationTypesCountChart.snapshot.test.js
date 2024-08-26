import React from 'react';
import AuthorsPublicationTypesCountChart from './AuthorsPublicationTypesCountChart';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = { ...testProps };
    return rtlRender(<AuthorsPublicationTypesCountChart {...props} />);
}

describe('AuthorsPublicationTypesCountChart ', () => {
    it('should render with default props chart component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render empty chart component', () => {
        const { container } = setup({ series: [] });
        expect(container).toMatchSnapshot();
    });
});
