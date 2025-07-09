import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';
import BibliographicSection from './BibliographicSection';

jest.mock('../../../../context');

import { useJournalContext } from 'context';
import { journalDoaj } from 'mock/data';
import { ADMIN_JOURNAL } from 'config/general';

function setup(testProps = {}, renderer = rtlRender) {
    const { values = {}, ...rest } = testProps;
    const props = {
        ...rest,
    };

    return renderer(
        <FormProviderWrapper
            values={{
                ...values,
            }}
        >
            <BibliographicSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('BibliographicSection component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        const { getByTestId } = setup({
            values: {
                journal: {
                    ...journalDoaj.data,
                },
            },
        });
        expect(document.querySelector('.AdminCard')).toHaveTextContent('ISSN');
        expect(getByTestId('jnl_issn_jid-input')).toBeInTheDocument();
    });

    it('should render disabled view', () => {
        useJournalContext.mockImplementation(() => ({
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        const { getByTestId } = setup({
            values: {
                journal: {
                    ...journalDoaj.data,
                },
            },
            disabled: true,
        });
        expect(getByTestId('jnl_issn_jid-input')).toHaveAttribute('disabled');
    });
});
