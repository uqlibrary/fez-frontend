import React from 'react';
import CitationView from './CitationView';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        ...testProps,
        prefix: testProps.prefix || ' ',
        suffix: testProps.suffix || '.',
        value: testProps.value,
        className: testProps.className || '',
    };
    return rtlRender(<CitationView {...props} />);
}

describe('CitationView test ', () => {
    it('should render component with empty span', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render component with correct props', () => {
        const { container } = setup({ prefix: ' ', suffix: ':', className: 'citationClassName', value: 'Some text' });
        expect(container).toMatchSnapshot();
    });

    it('should render component with correct suffix', () => {
        const { container } = setup({ prefix: ' ', suffix: '.', className: 'citationClassName', value: 'Some text.' });
        expect(container).toMatchSnapshot();
    });

    it('should render component with no prefix or suffix', () => {
        const { container } = setup({ prefix: ' ', suffix: '.', className: 'citationClassName' });
        expect(container).toMatchSnapshot();
    });

    it('should render component with no className', () => {
        const { container } = setup({ value: 'Some text.' });
        expect(container).toMatchSnapshot();
    });
});
