import React from 'react';
import SecurityCard, { overrideSecurityValueNormalizer, getRecordType, isSame } from './SecurityCard';
import { List } from 'immutable';
import { DOCUMENT_TYPE_JOURNAL_ARTICLE, PUBLICATION_TYPE_JOURNAL_ARTICLE } from 'config/general';
import { rtlRender } from 'test-utils';

jest.mock('../../../../context');
import { useFormValuesContext, useRecordContext } from 'context';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: props => {
        return (
            <field
                is="mock"
                name={props.name}
                title={props.title}
                required={props.required}
                disabled={props.disabled}
                label={props.label || props.floatingLabelText}
                hasError={props.hasError}
            />
        );
    },
}));

function setup(testProps = {}) {
    const props = {
        disabled: false,
        ...testProps,
    };
    return rtlRender(<SecurityCard {...props} />);
}

describe('SecurityCard component', () => {
    it('should render security card correctly for record type', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
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
        }));

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

        const { container, getAllByText } = setup();

        expect(container).toMatchSnapshot();
        expect(getAllByText('Test collection').length).toEqual(2);
        expect(container.querySelector('field[name="securitySection.rek_security_policy"]')).not.toBeInTheDocument();
        expect(container.querySelector('field[name="securitySection.rek_datastream_policy"]')).not.toBeInTheDocument();
    });

    it('should not render data stream security selector for the record if no datastreams found', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: [],
                rek_security_inherited: 1,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

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

        const { container, getAllByText } = setup();

        expect(container).toMatchSnapshot();
        expect(getAllByText('Test collection').length).toEqual(1);
        expect(container.querySelector('field[name="securitySection.rek_security_policy"]')).not.toBeInTheDocument();
        expect(container.querySelector('field[name="securitySection.rek_datastream_policy"]')).not.toBeInTheDocument();
    });

    it('should render security card correctly for record type if user checks override security', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([
                    {
                        dsi_dsid: 'test2.txt',
                        dsi_security_policy: 1,
                    },
                ]),
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

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

        const { container, getAllByText } = setup();

        expect(container).toMatchSnapshot();
        expect(getAllByText('Test collection').length).toEqual(2);
        expect(container.querySelector('field[name="securitySection.rek_security_policy"]')).toBeInTheDocument();
    });

    it('should render security card correctly for collection with data stream selector for collection', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([]),
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Collection',
            },
        }));

        const { container } = setup();

        expect(container).toMatchSnapshot();
        expect(container.querySelector('field[name="securitySection.rek_security_policy"]')).toBeInTheDocument();
        expect(container.querySelector('field[name="securitySection.rek_datastream_policy"]')).toBeInTheDocument();
    });

    it('should render security card correctly for community', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_object_type_lookup: 'Community',
            },
        }));

        const { container } = setup();

        expect(container).toMatchSnapshot();
        expect(container.querySelector('field[name="securitySection.rek_security_policy"]')).toBeInTheDocument();
        expect(container.querySelector('field[name="securitySection.rek_datastream_policy"]')).not.toBeInTheDocument();
    });

    it('should render security card with disabled inputs', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([
                    {
                        dsi_dsid: 'test3.txt',
                        dsi_security_policy: 1,
                    },
                ]),
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

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

        const { container, getAllByText } = setup({ disabled: true });

        expect(container).toMatchSnapshot();
        expect(getAllByText('Test collection').length).toEqual(2);
        expect(container.querySelector('field[name="securitySection.rek_security_policy"]')).toBeInTheDocument();
        expect(container.querySelector('field[name="securitySection.rek_datastream_policy"]')).not.toBeInTheDocument();
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
