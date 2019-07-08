import { PolicyDescription } from './PolicyDescription';

describe('PolicyDescription helper', () => {
    it('should render properly', () => {
        const wrapper = getElement(PolicyDescription, {
            selectedPolicyKey: 1,
        }, true);
        expect(toJson(wrapper)).toEqual('Administrators (1)');
    });

    it('should return empty string when policy key selection is missing', () => {
        const wrapper = getElement(PolicyDescription, {}, true);
        expect(toJson(wrapper)).toBe('');
    });

    it('should render properly when a custom policy array is provided', () => {
        const wrapper = getElement(
            PolicyDescription,
            {
                selectedPolicyKey: 2,
                policyArray: [
                    { id: 1, value: 1, name: 'name 1' },
                    { id: 2, value: 2, name: 'name 2' },
                    { id: 3, value: 3, name: 'name 3' },
                ],
            },
            true
        );
        expect(toJson(wrapper)).toEqual('name 2 (2)');
    });
});
