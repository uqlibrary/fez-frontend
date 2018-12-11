jest.dontMock('./BookForm');

import BookForm from './BookForm';
import {NTRO_SUBTYPE_OCW_MUSICAL_COMPOSITION} from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
        subtypeVocabId: testProps.subtypeVocabId || 0, // : PropTypes.number
    };
    return getElement(BookForm, props, isShallow);
}

describe('BookForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 11 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(11);
    });

    it('component with 12 input fields for NTRO', () => {
        const wrapper = setup({isNtro: true});
        expect(wrapper.find('Field').length).toEqual(12);
    });

    it('component with 13 input fields for NTRO with musical composition subtype', () => {
        const wrapper = setup({isNtro: true, subtype: NTRO_SUBTYPE_OCW_MUSICAL_COMPOSITION});
        expect(wrapper.find('Field').length).toEqual(13);
    });

    it('component with 6 required input fields', () => {
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
