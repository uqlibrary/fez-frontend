import React from 'react';
import JournalTemplate from './JournalTemplate';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<JournalTemplate {...props} />);
}
describe('JournalTemplate component', () => {
    it('should render FoR option correctly', () => {
        const { getByText } = setup({
            option: {
                jnl_title: 'Test journal',
                fez_journal_issn: [{ jnl_issn: '1234-5678' }],
            },
        });

        expect(getByText('Test journal')).toBeInTheDocument();
        expect(getByText('1234-5678')).toBeInTheDocument();
    });
});
