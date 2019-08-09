jest.dontMock('./DesignForm');

import DesignForm from './DesignForm';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(DesignForm, props, isShallow);
}

describe('DesignForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 9 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(9);
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
                .find('Field').length
        ).toEqual(7);
    });
});
