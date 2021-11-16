import React from 'react';
import { render } from 'test-utils';
import { PrefixedLinkTemplate } from './PrefixedLinkTemplate';

function setup(testProps = {}) {
    const props = {
        fieldId: 'jnl-uq-author-count',
        templateProps: {
            href: () => 'http://library.uq.edu.au',
            text: () => 'View these articles in UQ eSpace',
            ...testProps,
        },
    };
    return render(<PrefixedLinkTemplate {...props} />);
}

describe('LinkTemplate', () => {
    it('Should contain a link prefix if supplied', () => {
        const { getByTestId } = setup({
            prefix: () => '200',
        });
        expect(getByTestId('jnl-uq-author-count-link-prefix')).toBeInTheDocument();
    });
    it('Should not contain a link prefix if none supplied', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('jnl-uq-author-count-link-prefix')).not.toBeInTheDocument();
    });
});
