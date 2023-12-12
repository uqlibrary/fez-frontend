import React from 'react';
import { rtlRender, WithReduxStore } from 'test-utils';
import DoajSection from './DoajSection';

jest.mock('../../../../context');
import { useJournalContext, useFormValuesContext } from 'context';
import { journalDoaj } from 'mock/data';
import { reduxForm } from 'redux-form';

const WithReduxForm = reduxForm({ form: 'testForm' })(DoajSection);

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

describe('DoajSection component', () => {
    it('should render default view', () => {
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

        expect(getByTestId('ulr-open-access-header')).toHaveTextContent('Open access');
        expect(getByTestId('ulr-open-access-value')).toHaveTextContent('No');
        expect(getByTestId('jnl-doaj-homepage-url-header')).toHaveTextContent('Journal home page');
        expect(getByTestId('jnl-doaj-homepage-url-lookup-link')).toHaveAttribute(
            'href',
            'https://www.degruyter.com/journal/key/ans/html',
        );
        expect(getByTestId('jnl-doaj-apc-average-price-header')).toHaveTextContent('Article processing charges');
        expect(getByTestId('jnl-doaj-apc-average-price-value')).toHaveTextContent('1000 EUR');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-header')).toHaveTextContent('Journal licence');
        expect(getByTestId('jnl-doaj-by-sa-nd-nc-lookup-link')).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en',
        );
        expect(getByTestId('jnl-doaj-seal-header')).toHaveTextContent('DOAJ seal');
        expect(getByTestId('jnl-doaj-seal-value')).toHaveTextContent('No');
        expect(getByTestId('jnl-doaj-last-updated-header')).toHaveTextContent('Last updated');
        expect(getByTestId('jnl-doaj-last-updated-value')).toHaveTextContent('22nd August 2022 at 9:57am');
    });
});
