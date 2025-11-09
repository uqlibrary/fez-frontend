import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';
import ReadAndPublishSection from './ReadAndPublishSection';

jest.mock('../../../../context');
import { useJournalContext } from 'context';
import { journalDoaj } from 'mock/data';
import { ADMIN_JOURNAL } from 'config/general';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };

    return renderer(
        <FormProviderWrapper>
            <ReadAndPublishSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('ReadAndPublishSection component', () => {
    it('should render default view', () => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                ...journalDoaj.data,
            },
            jnlDisplayType: ADMIN_JOURNAL,
        }));

        const { getByTestId } = setup();

        expect(getByTestId('jnl-read-and-publish-header')).toHaveTextContent('Read and publish agreement');
        expect(getByTestId('jnl-read-and-publish-link-prefix')).toHaveTextContent(
            'Yes discount available, via De Gruyter',
        );
        expect(getByTestId('jnl-read-and-publish-lookup-link')).toHaveAttribute(
            'href',
            'https://web.library.uq.edu.au/research-and-publish/open-research/read-and-publish-agreements',
        );

        expect(getByTestId('jnl-read-and-publish-source-date-header')).toHaveTextContent('Last updated');
        expect(getByTestId('jnl-read-and-publish-source-date-value')).toHaveTextContent('19th July 2023');
    });
});
