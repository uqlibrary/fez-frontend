import { IdentifiersSectionContainer } from './IdentifiersSectionContainer';

jest.mock('context');

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        formValues: {
            toJS: jest.fn(() => ({})),
        },
        ...testProps,
    };

    return getElement(IdentifiersSectionContainer, props, args);
}

describe('IdentifiersSectionContainer component', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
