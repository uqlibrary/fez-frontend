import React from 'react';
import AddSection from './AddSection';
import { rtlRender, WithReduxStore, WithRouter, FormProviderWrapper } from 'test-utils';

function setup(testProps = {}) {
    const { values = {}, ...rest } = testProps;
    const props = {
        ...rest,
    };

    return rtlRender(
        <WithReduxStore>
            <WithRouter>
                <FormProviderWrapper
                    values={{
                        ...values,
                    }}
                >
                    <AddSection {...props} />
                </FormProviderWrapper>
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('AddSection component', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render with subtypes', () => {
        const { container } = setup({
            values: { rek_display_type: 130, adminSection: { rek_subtype: 'Fully published paper' } },
        });
        expect(container).toMatchSnapshot();
    });
});
