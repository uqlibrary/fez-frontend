jest.dontMock('./CreativeWorkForm');

import CreativeWorkForm from './CreativeWorkForm';
import { NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT, NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE } from 'config/general';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
        subtypeVocabId: testProps.subtypeVocabId || 0, // : PropTypes.number
    };
    return getElement(CreativeWorkForm, props);
}

describe('CreativeWorkForm renders ', () => {
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

    it('should show exhibition content correctly', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
            isNtro: true,
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show content for a random (other) NTRO type correctly (base case)', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
            isNtro: true,
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
