import React from 'react';
import AddSection from './AddSection';
import { render, WithReduxStore, WithRouter, FormProviderWrapper } from 'test-utils';

function setup(testProps = {}) {
    const { values = {}, ...rest } = testProps;
    const props = {
        ...rest,
    };

    return render(
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
    describe('with coverage', () => {
        it('should render with default doc type sub type', () => {
            const { container } = setup({
                values: {
                    rek_display_type: 1005,
                    adminSection: {
                        rek_subtype: 'Creative Work - Textual',
                        collections: [
                            {
                                id: 'UQ:3838',
                                rek_title: 'School of Languages and Cultures Publications',
                            },
                        ],
                    },
                },
                disabled: true,
            });
            expect(container).toMatchSnapshot();
        });
    });
});
