jest.dontMock('./BookForm');

import BookForm from './BookForm';
import {NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION} from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool
    };
    return getElement(BookForm, props, isShallow);
}

describe('BookForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 10 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(10);
    });

    it('component with 4 input fields for NTRO', () => {
        const wrapper = setup({isNtro: true});
        expect(wrapper.find('NtroFields').dive().find('Field').length).toEqual(4);
    });

    it('component with 5 input fields for NTRO with musical composition subtype', () => {
        const wrapper = setup({isNtro: true, subtype: NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION});
        expect(wrapper.find('NtroFields').dive().find('Field').length).toEqual(5);
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
