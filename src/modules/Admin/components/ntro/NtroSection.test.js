import React from 'react';
import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';
import NtroSection from './NtroSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };
    return renderer(
        <WithReduxStore>
            <FormProviderWrapper values={{}}>
                <NtroSection {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
}

describe('NtroSection component', () => {
    it('should render default view', () => {
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

        const { container } = setup({});
        expect(document.querySelectorAll('input[disabled=""]')).toHaveLength(0);
        expect(container).toMatchSnapshot();
    });

    it('should render disabled view', () => {
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

        const { container } = setup({ disabled: true });
        expect(document.querySelectorAll('input[disabled=""]')).toHaveLength(2);
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
                rek_display_type: 316,
                rek_subtype: 'Creative Work - Design/Architectural',
            },
        }));

        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should not render ismn field for Book - Creative Work - Musical Composition', () => {
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
                rek_display_type: 174,
                rek_subtype: 'Creative Work - Musical Composition',
            },
        }));

        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
