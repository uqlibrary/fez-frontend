import React from 'react';
import { rtlRender, WithReduxStore } from 'test-utils';
import BibliographicSectionContainer from './BibliographicSectionContainer';

jest.mock('../../../../context');
import { useJournalContext } from 'context';
import { journalDoaj } from 'mock/data';
import { reduxForm } from 'redux-form';

const WithReduxForm = reduxForm({
    form: 'AdminJournalForm',
})(BibliographicSectionContainer);

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };

    return renderer(
        <WithReduxStore>
            <WithReduxForm {...props} />
        </WithReduxStore>,
    );
}

describe('BibliographicSectionContainer component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
            },
            jnlDisplayType: 'adminjournal',
        }));

        const { getByTestId } = setup();
        expect(document.querySelector('.AdminCard')).toHaveTextContent('ISSN');
        expect(getByTestId('jnl_issn_jid-input')).toBeInTheDocument();
    });
});
