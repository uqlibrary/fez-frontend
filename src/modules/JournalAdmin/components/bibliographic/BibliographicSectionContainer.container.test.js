import React from 'react';
import { rtlRender, WithReduxStore } from 'test-utils';
import { BibliographicSectionContainer, mapStateToProps } from './BibliographicSectionContainer';
import Immutable from 'immutable';
import { journalDoaj } from 'mock/data';
import { reduxForm } from 'redux-form';
jest.mock('../../../../context');
import { useJournalContext, useFormValuesContext } from 'context';

const WithReduxForm = reduxForm({ form: 'testForm', formValues: Immutable.Map({ ...journalDoaj.data }) })(
    BibliographicSectionContainer,
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

describe('BibliographicSectionContainer component', () => {
    beforeEach(() => {
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
    });
    it('should render default view', () => {
        const { getByTestId } = setup();
        expect(document.querySelector('.AdminCard')).toHaveTextContent('ISSN');
        expect(getByTestId('jnl_issn_jid-input')).toBeInTheDocument();
    });

    it('should render disabled view', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('jnl_issn_jid-input')).toHaveAttribute('disabled');
    });

    it('should map state to props', () => {
        expect(mapStateToProps({}, {})).toEqual({
            formValues: Immutable.Map({}),
        });
    });
});
