import { PolicyDropdown } from './PolicyDropdown';

function setup(testProps = {}) {
    const props = {
        fieldName: 'test',
        policyDropdownId: 'test-policy',
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

    it('should hide policies that the user cant select', () => {
        const wrapper = setup({
            inheritedSecurity: 2,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
