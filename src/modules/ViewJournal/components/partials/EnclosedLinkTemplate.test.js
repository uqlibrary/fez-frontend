import React from 'react';
import { render } from 'test-utils';
import { EnclosedLinkTemplate } from './EnclosedLinkTemplate';

function setup(testProps = {}) {
    const props = {
        fieldId: 'jnl-uq-author-count',
        templateProps: {
            href: () => 'http://library.uq.edu.au',
            text: () => 'View these articles in UQ eSpace',
            ...testProps,
        },
    };
    return render(<EnclosedLinkTemplate {...props} />);
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

    it('Should contain a link postfix if supplied', () => {
        const { getByTestId } = setup({
            postfix: () => 'post',
        });
        expect(getByTestId('jnl-uq-author-count-link-postfix')).toBeInTheDocument();
    });

    it('Should not contain a link postfix if none supplied', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId('jnl-uq-author-count-link-postfix')).not.toBeInTheDocument();
    });

    it('Should not contain a link if href is not provided', () => {
        const { queryByTestId } = setup({ href: () => '' });
        expect(queryByTestId('jnl-uq-author-count-link-lookup')).not.toBeInTheDocument();
    });

    it('Should not contain a link if link text is not provided', () => {
        const { queryByTestId } = setup({ text: () => '' });
        expect(queryByTestId('jnl-uq-author-count-link-lookup')).not.toBeInTheDocument();
    });
});
