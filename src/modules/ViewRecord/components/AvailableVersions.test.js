import React from 'react';
import { dataCollection } from 'mock/data/testing/records';
import AvailableVersions from './AvailableVersions';
import { rtlRender, WithRouter } from 'test-utils';

function setup(testProps) {
    const props = {
        ...testProps,
        publication: testProps.publication || dataCollection,
        title: testProps.title || '',
    };
    return rtlRender(
        <WithRouter>
            <AvailableVersions {...props} />
        </WithRouter>,
    );
}

describe('Available Versions Component ', () => {
    it('should render component', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
        // expect(wrapper.find('.availableVersions li').length).toEqual(2);
    });
});
