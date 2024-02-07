import React from 'react';
import { rtlRender, WithReduxStore } from 'test-utils';
import UqDataSection from './UqDataSection';

jest.mock('../../../../context');
import { useJournalContext, useFormValuesContext } from 'context';
import { journalDoaj } from 'mock/data';
import { reduxForm } from 'redux-form';

const WithReduxForm = reduxForm({ form: 'testForm' })(UqDataSection);

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

describe('UqDataSection component', () => {
    it('should render default view (discounted)', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
            },
            jnlDisplayType: 'adminjournal',
        }));
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                languages: ['eng'],
            },
        }));

        const { getByTestId } = setup();

        expect(getByTestId('jnl-read-and-publish-header')).toHaveTextContent('Read and publish agreement');
        expect(getByTestId('jnl-read-and-publish-link-prefix')).toHaveTextContent(
            'Yes discount available, via De Gruyter',
        );
        expect(getByTestId('jnl-read-and-publish-lookup-link')).toHaveAttribute(
            'href',
            'https://web.library.uq.edu.au/read-and-publish-agreements',
        );

        expect(getByTestId('jnl-uq-author-count-header')).toHaveTextContent('Recently published UQ authors');
        expect(getByTestId('jnl-uq-author-count-value')).toHaveTextContent('0');
    });

    it('should render default view (not discounted)', () => {
        const mockNoDiscount = {
            fez_journal_read_and_publish: {
                jnl_read_and_publish_issn: '2169-0375',
                jnl_read_and_publish_title: 'Advanced Nonlinear Studies',
                jnl_read_and_publish_publisher: 'De Gruyter',
                jnl_read_and_publish_is_capped: false,
                jnl_read_and_publish_is_discounted: false,
                jnl_read_and_publish_source_date: '2023-07-19',
            },
        };
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
                ...mockNoDiscount,
            },
            jnlDisplayType: 'adminjournal',
        }));
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                languages: ['eng'],
            },
        }));

        const { getByTestId } = setup();

        expect(getByTestId('jnl-read-and-publish-header')).toHaveTextContent('Read and publish agreement');
        expect(getByTestId('jnl-read-and-publish-link-prefix')).toHaveTextContent('Yes, via De Gruyter');
        expect(getByTestId('jnl-read-and-publish-lookup-link')).toHaveAttribute(
            'href',
            'https://web.library.uq.edu.au/read-and-publish-agreements',
        );

        expect(getByTestId('jnl-uq-author-count-header')).toHaveTextContent('Recently published UQ authors');
        expect(getByTestId('jnl-uq-author-count-value')).toHaveTextContent('0');
    });
});
