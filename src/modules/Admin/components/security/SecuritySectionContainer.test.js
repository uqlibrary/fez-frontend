import React from 'react';
import SecuritySectionContainer from './SecuritySectionContainer';
import Immutable from 'immutable';

jest.mock('redux-form/immutable', () => ({
    getFormValues: jest.fn(() =>
        jest.fn(() => ({
            get: jest.fn(() => ({ toJS: jest.fn(() => ({})) })),
        }))
    ),
    Field: jest.fn(() => {
        const Dummy = props => <div {...props} />;
        return Dummy;
    }),
}));
import { getFormValues } from 'redux-form/immutable';

jest.mock('../../../../context');
import { useRecordContext, useFormValuesContext } from 'context';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        disabled: false,
        isSuperAdmin: true,
        ...testProps,
    };

    return getElement(SecuritySectionContainer, props, args);
}

describe('SecuritySectionContainer', () => {
    it('should mount with default props', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: Immutable.List([
                    {
                        dsi_dsid: 'test.txt',
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
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should fallback to default form values', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
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
        getFormValues.mockImplementation(() => jest.fn(() => null));
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should mount with default props', () => {
        const store = {
            ...global.setupStoreForMount.store,
            getState: jest.fn(() =>
                Immutable.Map({
                    authorDetails: {
                        is_super_administrator: true,
                    },
                })
            ),
        };

        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                rek_security_inherited: 1,
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
        const wrapper = setup(
            {
                isSuperAdmin: false,
            },
            { isShallow: false, store: store }
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
