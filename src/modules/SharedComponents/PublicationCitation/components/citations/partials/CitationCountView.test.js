import React from 'react';
import CitationCountView from './CitationCountView';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        ...testProps,
        source: testProps.source,
        count: testProps.count,
        link: testProps.link,
        title: testProps.title,
    };
    return render(
        <WithRouter>
            <CitationCountView {...props} />
        </WithRouter>,
    );
}

describe('CitationCountView test ', () => {
    it('should render component with given count', () => {
        const { container } = setup({ source: 'wos', count: 4, link: 'www.google.com', title: 'Google' });
        expect(container).toMatchSnapshot();
    });
});
