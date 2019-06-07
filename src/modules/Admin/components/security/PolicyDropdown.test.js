import { PolicyDropdown } from './PolicyDropdown';

const setup = (testProps, isShallow = true) => {
    const props = {
        fieldName: 'test',
        ...testProps
    };
    return getElement(PolicyDropdown, props, isShallow);
};

describe('PolicyDropdown component', () => {
    it('should render properly', () => {
        const wrapper = setup({
            displayPrompt: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});