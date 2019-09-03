jest.dontMock('./VideoDocumentForm');

import VideoDocumentForm from './VideoDocumentForm';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(VideoDocumentForm, props);
}

describe('VideoDocumentForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 9 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(9);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });

    it('component should render contributor assignment', () => {
        const wrapper = setup({
            formValues: {
                get: key => {
                    const values = {
                        editors: [{ selected: true }, { selected: true }],
                        authors: [{ selected: true }, { selected: true }],
                    };
                    return values[key];
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
