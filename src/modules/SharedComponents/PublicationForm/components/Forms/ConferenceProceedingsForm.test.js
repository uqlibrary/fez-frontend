jest.dontMock('./ConferenceProceedingsForm');

import ConferenceProceedingsForm from './ConferenceProceedingsForm';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(ConferenceProceedingsForm, props);
}

describe('ConferenceProceedingsForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 12 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(12);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });
});
