import React from 'react';
import { SocialShare } from './SocialShare';
import { journalArticle } from 'mock/data/testing/records';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps) {
    const props = {
        publication: journalArticle,
        services: ['email', 'print'],
        ...testProps,
    };
    return rtlRender(<SocialShare {...props} />);
}

describe('Component SocialShare', () => {
    it('should render component', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should fire print method on click', () => {
        global.print = jest.fn();
        const { container, getByTestId } = setup({});
        fireEvent.click(getByTestId('print-link'));
        expect(global.print).toHaveBeenCalled();
        expect(container).toMatchSnapshot();
    });
});
