import { NTRO_SUBTYPE_DESIGN_CW_ARCHITECTURAL_WORK } from 'config/general';

jest.dontMock('./DesignForm');

import DesignForm from './DesignForm';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(DesignForm, props);
}

describe('DesignForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 11 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(11);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });

    it('component with 6 input fields for NTRO', () => {
        const wrapper = setup({ isNtro: true });
        expect(
            wrapper
                .find('NtroFields')
                .dive()
                .find('Field').length,
        ).toEqual(7);
    });

    it('should show architectural content correctly', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_DESIGN_CW_ARCHITECTURAL_WORK,
            isNtro: true,
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
