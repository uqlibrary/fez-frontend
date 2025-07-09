import React from 'react';
import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';
import AdminSection from './AdminSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup({ values, ...testProps } = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(
        <WithReduxStore>
            <FormProviderWrapper
                values={{
                    adminSection: {
                        rek_subtype: 'Creative Work - Design/Architectural',
                        ...values,
                    },
                }}
            >
                <AdminSection {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
}

describe('AdminSection component', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Record',
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof: 'Test collection',
                        parent: {
                            rek_security_policy: 2,
                            rek_datastream_policy: 1,
                        },
                    },
                ],
                rek_display_type: 179,
                fez_record_search_key_language: [{ rek_language: 'eng' }],
            },
        }));
    });

    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });

    it('should render design form fields', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Record',
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof: 'Test collection',
                        parent: {
                            rek_security_policy: 2,
                            rek_datastream_policy: 1,
                        },
                    },
                ],
                rek_display_type: 313,
                rek_subtype: 'Creative Work - Design/Architectural',
            },
        }));

        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
