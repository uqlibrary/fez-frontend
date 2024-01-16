import React from 'react';
import { rtlRender, WithReduxStore } from 'test-utils';
import BibliographicSection from './BibliographicSection';

jest.mock('../../../../context');
import { useJournalContext, useFormValuesContext } from 'context';
import Immutable from 'immutable';
import { journalDoaj } from 'mock/data';
import { reduxForm } from 'redux-form';

const WithReduxForm = reduxForm({ form: 'testForm', formValues: Immutable.Map({ ...journalDoaj.data }) })(
    BibliographicSection,
);

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

describe('BibliographicSection component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                jnl_jid: 12,
            },
            jnlDisplayType: 'adminjournal',
        }));
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                languages: ['eng'],
            },
        }));

        const { getByTestId } = setup();
        expect(document.querySelector('.AdminCard')).toHaveTextContent('ISSN');
        expect(getByTestId('jnl_issn_jid-input')).toBeInTheDocument();
    });

    it('should render disabled view', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                jnl_jid: 12,
            },
            jnlDisplayType: 'adminjournal',
        }));

        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                languages: ['eng'],
            },
        }));

        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('jnl_issn_jid-input')).toHaveAttribute('disabled');
    });
});
