import React from 'react';
import CitationTitleView from './CitationTitleView';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = { ...testProps };
    return rtlRender(<CitationTitleView {...props} />);
}

describe('CitationTitleView partial', () => {
    it('should render default view', () => {
        const { container } = setup({
            prefix: 'prefix',
            suffix: 'suffix',
            className: 'className',
            value: 'value',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render properly with empty props', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render properly with value prop only', () => {
        const { container } = setup({
            value: 'value',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render properly with a suffix that equal to the last character of the value', () => {
        const { container } = setup({
            value: 'values',
            suffix: 's',
        });
        expect(container).toMatchSnapshot();
    });
});
