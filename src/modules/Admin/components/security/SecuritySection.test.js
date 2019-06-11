import React from 'react';
import SecuritySection from './SecuritySection';
import { shallow } from 'enzyme';
import { locale } from 'locale';

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
        handleSubmit: jest.fn(),
        text: locale.components.securitySection,
        ...testProps
    };
    return shallow(<SecuritySection {...props}/>);
};


describe('SecuritySection component', () => {
    it('should render record edit form for an Admin', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                accessLevel: 'Admin'
            }
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_security_inherited: 1,
                rek_object_type_lookup: 'Record'
            }
        }));

        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(SecurityCard)').length).toBe(1);
    });

    it('should not render community edit form for an Admin', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                accessLevel: 'Admin'
            }
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_security_inherited: 1,
                rek_object_type_lookup: 'Community'
            }
        }));

        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(SecurityCard)').length).toBe(0);
    });

    it('should not render collection edit form for an Admin', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                accessLevel: 'Admin'
            }
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_security_inherited: 1,
                rek_object_type_lookup: 'Collection'
            }
        }));

        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Memo(SecurityCard)').length).toBe(0);
    });

    it('should render properly for a Superadmin', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                accessLevel: 'Superadmin'
            }
        }));

        useRecordContext.mockImplementation(() => ({
            record: {
                rek_security_inherited: 1,
                rek_object_type_lookup: 'Collection'
            }
        }));

        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});