jest.dontMock('./BookChapterForm');

import BookChapterForm from './BookChapterForm';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
        subtypeVocabId: testProps.subtypeVocabId || 0, // : PropTypes.number
    };
    return getElement(BookChapterForm, props, isShallow);
}

describe('BookChapterForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 14 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(14);
    });

    it('component with 9 required input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field .requiredHintField').length).toEqual(1);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });
});
