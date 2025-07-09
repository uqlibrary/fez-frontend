import React from 'react';
import SecuritySectionContainer from './SecuritySectionContainer';
import Immutable from 'immutable';

jest.mock('redux-form/immutable', () => ({
    getFormValues: jest.fn(() =>
        jest.fn(() => ({
            get: jest.fn(() => ({ toJS: jest.fn(() => ({})) })),
        })),
    ),
    Field: () => props => <div {...props} />,
}));
import { getFormValues } from 'redux-form/immutable';

jest.mock('../../../../context');
import { useRecordContext, useFormValuesContext } from 'context';
import { render, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        disabled: false,
        isSuperAdmin: true,
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <SecuritySectionContainer {...props} />
        </WithReduxStore>,
    );
}

describe('SecuritySectionContainer', () => {
    it('should mount with default props for a record', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: Immutable.List([
                    {
                        dsi_dsid: 'test7.txt',
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
        const { container } = setup();
        expect(container).toMatchSnapshot();
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
        getFormValues.mockImplementation(() => jest.fn(() => null));
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should mount with default props for a collection for a super admin', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                rek_security_inherited: 1,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123458',
                rek_object_type_lookup: 'Collection',
            },
        }));
        const { container } = setup(
            {
                isSuperAdmin: false,
            },
            {
                isShallow: false,
                store: global.setupStoreForMount(
                    Immutable.Map({
                        authorDetails: {
                            is_super_administrator: true,
                        },
                    }),
                ).store,
            },
        );
        expect(container).toMatchSnapshot();
    });
});
