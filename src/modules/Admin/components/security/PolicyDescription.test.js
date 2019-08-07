import { PolicyDescription } from './PolicyDescription';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };
    return getElement(PolicyDescription, props);
}
describe('PolicyDescription helper', () => {
    it('should render properly', () => {
        const wrapper = setup({
            selectedPolicyKey: 1,
        });
        expect(toJson(wrapper)).toEqual('Administrators (1)');
    });

    it('should return empty string when policy key selection is missing', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toBe('');
    });

    it('should render properly when a custom policy array is provided', () => {
        const wrapper = setup({
            selectedPolicyKey: 2,
            policyArray: [
                { id: 1, value: 1, name: 'name 1' },
                { id: 2, value: 2, name: 'name 2' },
                { id: 3, value: 3, name: 'name 3' },
            ],
        });
        expect(toJson(wrapper)).toEqual('name 2 (2)');
    });
});
