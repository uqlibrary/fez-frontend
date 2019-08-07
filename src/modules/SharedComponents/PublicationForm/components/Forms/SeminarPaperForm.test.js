jest.dontMock('./SeminarPaperForm');

import SeminarPaperForm from './SeminarPaperForm';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(SeminarPaperForm, props);
}

describe('SeminarPaperForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 8 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(8);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });
});
