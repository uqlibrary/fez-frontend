import React from 'react';
import Immutable from 'immutable';

import SecurityCard, { overrideSecurityValueNormalizer, getRecordType, isSame } from './SecurityCard';
import { List } from 'immutable';
import { DOCUMENT_TYPE_JOURNAL_ARTICLE, PUBLICATION_TYPE_JOURNAL_ARTICLE } from 'config/general';
import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';

jest.mock('../../../../context');
import { useRecordContext } from 'context';

function setup({ values = {}, ...rest } = {}, state = {}) {
    const props = {
        disabled: false,
        ...rest,
    };
    return rtlRender(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <FormProviderWrapper
                values={{
                    ...values,
                }}
            >
                <SecurityCard {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
}

describe('SecurityCard component', () => {
    it('should mount with default props for a record', () => {
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
            },
        }));
        const { container } = setup({
            values: {
                securitySection: {
                    dataStreams: [
                        {
                            dsi_dsid: 'test7.txt',
                            dsi_security_policy: 1,
                        },
                    ],
                    rek_security_inherited: 1,
                    rek_security_policy: 5,
                    rek_datastream_policy: 5,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should fallback to default form values', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123457',
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
            },
        }));
        const { container } = setup({
            values: {},
        });
        expect(container).toMatchSnapshot();
    });

    it('should mount with default props for a collection for a super admin', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123458',
                rek_object_type_lookup: 'Collection',
            },
        }));
        const { container } = setup(
            {
                values: {
                    securitySection: {
                        rek_security_inherited: 1,
                        rek_security_policy: 5,
                        rek_datastream_policy: 5,
                    },
                },
            },
            {
                accountReducer: {
                    authorDetails: {
                        is_super_administrator: true,
                    },
                },
            },
        );
        expect(container).toMatchSnapshot();
    });

    it('should render security card correctly for record type', () => {
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
            },
        }));

        const { container, getAllByText } = setup({
            values: {
                securitySection: {
                    dataStreams: new List([
                        {
                            dsi_dsid: 'test1.txt',
                            dsi_security_policy: 1,
                        },
                    ]),
                    rek_security_inherited: 1,
                    rek_security_policy: 5,
                    rek_datastream_policy: 5,
                },
            },
        });
        expect(container).toMatchSnapshot();
        expect(getAllByText('Test collection').length).toEqual(2);
        expect(container.querySelector('[name="securitySection.rek_security_policy"]')).toBeInTheDocument();
        expect(container.querySelector('[name="securitySection.rek_datastream_policy"]')).not.toBeInTheDocument();
    });

    it('should not render data stream security selector for the record if no datastreams found', () => {
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
            },
        }));

        const { container, getAllByText } = setup({
            values: {
                securitySection: {
                    dataStreams: [],
                    rek_security_inherited: 1,
                    rek_security_policy: 5,
                    rek_datastream_policy: 5,
                },
            },
        });
        expect(container).toMatchSnapshot();
        expect(getAllByText('Test collection').length).toEqual(1);
        expect(container.querySelector('[name="securitySection.rek_security_policy"]')).toBeInTheDocument();
        expect(container.querySelector('[name="securitySection.rek_datastream_policy"]')).not.toBeInTheDocument();
    });

    it('should render security card correctly for record type if user checks override security', () => {
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
            },
        }));

        const { container, getAllByText } = setup({
            values: {
                securitySection: {
                    dataStreams: new List([
                        {
                            dsi_dsid: 'test2.txt',
                            dsi_security_policy: 1,
                        },
                    ]),
                    rek_security_inherited: 1,
                    rek_security_policy: 5,
                    rek_datastream_policy: 5,
                },
            },
        });

        expect(container).toMatchSnapshot();
        expect(getAllByText('Test collection').length).toEqual(2);
        expect(container.querySelector('[name="securitySection.rek_security_policy"]')).toBeInTheDocument();
    });

    it('should render security card correctly for collection with data stream selector for collection', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Collection',
            },
        }));

        const { container } = setup({
            values: {
                securitySection: {
                    dataStreams: new List([]),
                    rek_security_inherited: 0,
                    rek_security_policy: 5,
                    rek_datastream_policy: 5,
                },
            },
        });
        expect(container).toMatchSnapshot();
        expect(container.querySelector('[name="securitySection.rek_security_policy"]')).toBeInTheDocument();
        expect(container.querySelector('[name="securitySection.rek_datastream_policy"]')).toBeInTheDocument();
    });

    it('should render security card correctly for community', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Community',
            },
        }));

        const { container } = setup({
            values: {
                securitySection: {
                    rek_security_inherited: 0,
                    rek_security_policy: 5,
                    rek_datastream_policy: 5,
                },
            },
        });

        expect(container).toMatchSnapshot();
        expect(container.querySelector('[name="securitySection.rek_security_policy"]')).toBeInTheDocument();
        expect(container.querySelector('[name="securitySection.rek_datastream_policy"]')).not.toBeInTheDocument();
    });

    it('should render security card with disabled inputs', () => {
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
            },
        }));

        const { container, getAllByText } = setup({
            disabled: true,
            values: {
                securitySection: {
                    dataStreams: new List([
                        {
                            dsi_dsid: 'test3.txt',
                            dsi_security_policy: 1,
                        },
                    ]),
                    rek_security_inherited: 1,
                    rek_security_policy: 5,
                    rek_datastream_policy: 5,
                },
            },
        });

        expect(container).toMatchSnapshot();
        expect(getAllByText('Test collection').length).toEqual(2);
        expect(container.querySelector('[name="securitySection.rek_security_policy"]')).toHaveAttribute('disabled');
        expect(container.querySelector('[name="securitySection.rek_datastream_policy"]')).not.toBeInTheDocument();
    });
});

describe('overrideSecurityValueNormalizer', () => {
    it('should return 1 or 0', () => {
        expect(overrideSecurityValueNormalizer(true)).toBe(0);
        expect(overrideSecurityValueNormalizer(false)).toBe(1);
    });
});

describe('getRecordType', () => {
    it('should get rek_object_type_lookup when present', () => {
        const record = {
            rek_object_type_lookup: 'Test',
        };
        expect(getRecordType(record)).toBe('test');
    });

    it('should get rek_display_type when present and rek_object_type_lookup is not', () => {
        const record = {
            rek_display_type: PUBLICATION_TYPE_JOURNAL_ARTICLE,
        };
        expect(getRecordType(record)).toBe(DOCUMENT_TYPE_JOURNAL_ARTICLE.toLowerCase());
    });

    it('should return null if neither rek_object_type_lookup nor rek_display_type is present', () => {
        expect(getRecordType({})).toBe(null);
    });
});

describe('isSame callback function', () => {
    it('should return true if current props are same as previous props', () => {
        expect(isSame({ disabled: true }, { disabled: true })).toBeTruthy();
    });

    it('should return false if props do not match', () => {
        expect(isSame({ disabled: true }, { disabled: false })).toBeFalsy();
    });
});
