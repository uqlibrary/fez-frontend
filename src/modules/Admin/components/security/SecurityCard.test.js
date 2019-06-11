import React from 'react';
import SecurityCard from './SecurityCard';
import { shallow } from 'enzyme';
import { locale } from 'locale';
import { List } from 'immutable';

jest.mock('../../../../context');
import { useFormValuesContext, useRecordContext } from 'context';

/*
    -   Enzyme doesn't support hooks yet
    -   Not using `getElement` global function to shallow render functional component
        because functional component using hooks are tricky to test with current setup.
    -   Work around is to mock implementation of hooks
*/
function setup(testProps = {}) {
    const props = {
        disabled: false,
        text: locale.components.securitySection[testProps.recordType || 'record'],
        recordType: 'record',
        isPolicyInherited: true,
        ...testProps
    };
    return shallow(<SecurityCard {...props}/>);
};


describe('SecurityCard component', () => {
    it('should render security card correctly for record type', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([{
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
                rek_pid: 'UQ:123456'
            }
        }));

        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(1);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(0);
    });

    it('should not render data stream security selector for the record if no datastreams found', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: [],
                rek_security_inherited: 1,
                rek_security_policy: 5,
                rek_datastream_policy: 5
            }
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456'
            }
        }));

        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(1);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(0);
    });

    it('should render security card correctly for record type if user checks override security', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([{
                    dsi_dsid: 'test.txt',
                    dsi_security_policy: 1
                }]),
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5
            }
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456'
            }
        }));

        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(0);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(1);
    });

    it('should render security card correctly for collection with data stream selector for collection', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([]),
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5
            }
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456'
            }
        }));

        const wrapper = setup({
            recordType: 'collection'
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(0);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(2);
    });

    it('should render security card correctly for community', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([]),
                rek_security_inherited: 0,
                rek_security_policy: 5,
                rek_datastream_policy: 5
            }
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456'
            }
        }));

        const wrapper = setup({
            recordType: 'community'
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(InheritedSecurityDetails)')).toHaveLength(0);
        expect(wrapper.find('Memo(SecuritySelector)')).toHaveLength(1);
    });
});