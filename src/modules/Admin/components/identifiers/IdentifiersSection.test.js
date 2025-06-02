import React from 'react';
import { rtlRender, FormProviderWrapper } from 'test-utils';
import IdentifiersSection from './IdentifiersSection';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        ...testProps,
    };

    return renderer(
        <FormProviderWrapper values={{}}>
            <IdentifiersSection {...props} />
        </FormProviderWrapper>,
    );
}

describe('IdentifiersSection component', () => {
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
        expect(document.querySelectorAll('input[disabled=""]')).toHaveLength(10);
        expect(container).toMatchSnapshot();
    });

    it('should render correct identifiers fields for Creative Work - Creative Work - Musical Composition', () => {
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
                rek_subtype: 'Creative Work - Musical Composition',
                fez_record_search_key_language: [{ rek_language: 'eng' }],
            },
        }));

        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });

    it('should render correct identifiers fields for Book - Creative Work - Musical Composition', () => {
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
                fez_record_search_key_language: [{ rek_language: 'eng' }],
            },
        }));

        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });
});
