jest.dontMock('./ConferencePaperForm');
import ConferencePaperForm from './ConferencePaperForm';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
        subtypeVocabId: testProps.subtypeVocabId || 0, // : PropTypes.number
    };
    return getElement(ConferencePaperForm, props);
}

describe('ConferencePaperForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 16 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(16);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ submitting: true });
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });
});
