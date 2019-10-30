import { AdminSectionContainer, mapStateToProps } from './AdminSectionContainer';
import Immutable from 'immutable';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        formValues: {
            toJS: jest.fn(() => ({})),
        },
        ...testProps,
    };

    return getElement(AdminSectionContainer, props, args);
}

describe('AdminSectionContainer component', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should map state to props', () => {
        expect(mapStateToProps({}, {})).toEqual({
            formValues: Immutable.Map({}),
        });
    });
});
