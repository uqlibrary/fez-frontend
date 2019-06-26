import React from 'react';
import SecuritySectionContainer from './SecuritySectionContainer';
import Immutable from 'immutable';

jest.mock('redux-form/immutable', () => ({
    getFormValues: jest.fn(() => jest.fn(() => ({
        get: jest.fn(() => ({ toJS: jest.fn(() => ({})) }))
    }))),
    Field: (props) => <div {...props} />
}));
import { getFormValues } from 'redux-form/immutable';


jest.mock('../../../../context');
import { useRecordContext, useFormValuesContext } from 'context';

function setup(testProps = {}, isShallow = false) {
    useFormValuesContext.mockImplementation(() => ({
        formValues: {
            dataStreams: Immutable.List([{
                dsi_dsid: 'test.txt',
                dsi_security_policy: 1
            }]),
            rek_security_inherited: 1,
            rek_security_policy: 5,
            rek_datastream_policy: 5
        }
    }));

    useRecordContext.mockImplementation(() => ({
        record: {
            rek_pid: 'UQ:123456',
            rek_object_type_lookup: 'Record',
            fez_record_search_key_ismemberof: [{
                rek_ismemberof: 'Test collection',
                parent: {
                    rek_security_policy: 2,
                    rek_datastream_policy: 1
                }
            }]
        }
    }));
    const props = {
        disabled: false,
        ...testProps
    };

    return getElement(SecuritySectionContainer, props, isShallow);
}

describe('SecuritySectionContainer', () => {
    it('should mount with default props', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should fallback to default form values', () => {
        getFormValues.mockImplementation(() => (jest.fn(() => null)));
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
