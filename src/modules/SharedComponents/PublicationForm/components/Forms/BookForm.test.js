jest.dontMock('./BookForm');

import BookForm from './BookForm';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION, SUBTYPE_EDITED_BOOK } from 'config/general';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool
    };
    return getElement(BookForm, props);
}

describe('BookForm renders ', () => {
    it('component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 10 input fields', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(12);
    });

    it('component with 4 input fields for NTRO', () => {
        const wrapper = setup({ isNtro: true });
        expect(
            wrapper
                .find('NtroFields')
                .dive()
                .find('Field').length,
        ).toEqual(5);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 5 input fields for NTRO with musical composition subtype', () => {
        const wrapper = setup({ isNtro: true, subtype: NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION });
        expect(
            wrapper
                .find('NtroFields')
                .dive()
                .find('Field').length,
        ).toEqual(6);
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

    it('should hide author when is edited book', () => {
        const wrapper = setup({ subtype: SUBTYPE_EDITED_BOOK });
        expect(wrapper.find('Field').length).toEqual(11);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show author when is not edited book', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(12);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component should render non ntro book', () => {
        const wrapper = setup({ isNtro: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
