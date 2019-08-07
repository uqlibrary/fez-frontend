jest.dontMock('./ImageDocumentForm');

import ImageDocumentForm from './ImageDocumentForm';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(ImageDocumentForm, props);
}

describe('ImageDocumentForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 6 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(6);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });
});
