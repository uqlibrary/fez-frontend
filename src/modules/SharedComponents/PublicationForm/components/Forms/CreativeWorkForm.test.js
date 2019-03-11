jest.dontMock('./CreativeWorkForm');

import CreativeWorkForm from './CreativeWorkForm';
import {NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT} from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
        subtypeVocabId: testProps.subtypeVocabId || 0, // : PropTypes.number
    };
    return getElement(CreativeWorkForm, props, isShallow);
}

describe('CreativeWorkForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 10 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(10);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });

    it('should show exhibition content correctly', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
            isNtro: true
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
