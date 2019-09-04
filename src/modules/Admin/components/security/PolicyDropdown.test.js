import { PolicyDropdown } from './PolicyDropdown';

function setup(testProps = {}) {
    const props = {
        fieldName: 'test',
        ...testProps,
    };
    return getElement(PolicyDropdown, props);
}

describe('PolicyDropdown component', () => {
    it('should render properly', () => {
        const wrapper = setup({
            displayPrompt: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
