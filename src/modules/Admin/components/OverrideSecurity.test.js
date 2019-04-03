import { OverrideSecurity } from './OverrideSecurity';

const setup = (testProps, isShallow = true) => {
    const props = {
        label: 'test',
        input: {
            onChange: jest.fn()
        },
        ...testProps
    };
    return getElement(OverrideSecurity, props, isShallow);
};

describe('OverrideSecurity component', () => {
    it('should render properly', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});