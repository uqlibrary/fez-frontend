import React from 'react';
import { UnpublishedBufferCitationView } from './UnpublishedBufferCitationView';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return rtlRender(<UnpublishedBufferCitationView {...props} />);
}

describe('UnpublishedBufferCitationView test button click sets value', () => {
    it('should render empty component with no date', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
