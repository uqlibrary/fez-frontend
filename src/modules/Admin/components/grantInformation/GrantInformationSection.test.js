import React from 'react';
import { rtlRender, FormProviderWrapper, assertDisabled, assertEnabled } from 'test-utils';
import GrantInformationSection from './GrantInformationSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

import { PUBLICATION_TYPE_JOURNAL_ARTICLE } from 'config/general';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };

    return renderer(
        <FormProviderWrapper values={{}}>
            <GrantInformationSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('GrantInformationSection', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_display_type: PUBLICATION_TYPE_JOURNAL_ARTICLE,
            },
        }));
    });

    afterEach(() => {
        useRecordContext.mockReset();
    });

    it('should render default view', () => {
        const { container, getByTestId } = setup({});
        assertEnabled(getByTestId('rek-grant-agency-input'));
        expect(container).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const { container, getByTestId } = setup({ disabled: true });
        assertDisabled(getByTestId('rek-grant-agency-input'));
        expect(container).toMatchSnapshot();
    });
});
