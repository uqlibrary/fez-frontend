import React from 'react';
import RelatedServicesSection from './RelatedServicesSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

import { PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';

import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };
    return renderer(
        <WithReduxStore>
            <FormProviderWrapper values={{}}>
                <RelatedServicesSection {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
}

describe('RelatedServicesSection', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
            },
        }));
    });

    afterEach(() => {
        useRecordContext.mockReset();
    });

    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });
});
