import React from 'react';
import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';

import AuthorsSection from './AuthorsSection';
import { PUBLICATION_TYPE_BOOK, SUBTYPE_EDITED_BOOK } from 'config/general';

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
                        ...values,
                    },
                }}
            >
                <AuthorsSection {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
}

describe('AuthorsSection component', () => {
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
            },
        }));

        const { container } = setup();
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
            },
        }));

        const { container } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
    });

    it('should render NTRO design form fields', () => {
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

        const { container } = setup({ values: { rek_subtype: 'Creative Work - Design/Architectural' } });
        expect(container).toMatchSnapshot();
    });

    it('should render non-NTRO design form fields', () => {
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
                rek_subtype: 'Non-NTRO',
            },
        }));

        const { container } = setup({ values: { rek_subtype: 'Non-NTRO' } });
        expect(container).toMatchSnapshot();
    });

    it('should render edited book form fields', () => {
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
                rek_display_type: PUBLICATION_TYPE_BOOK,
                rek_subtype: SUBTYPE_EDITED_BOOK,
            },
        }));

        const { container } = setup({ values: { rek_subtype: SUBTYPE_EDITED_BOOK } });
        expect(container).toMatchSnapshot();
    });
});
