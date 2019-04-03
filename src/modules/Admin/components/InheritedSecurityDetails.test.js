import { InheritedSecurityDetails } from './InheritedSecurityDetails';

describe('InheritedSecurityDetails component', () => {
    it('should render properly', () => {
        const wrapper = getElement(
            InheritedSecurityDetails,
            {
                selectedPolicyKey: 2
            },
            true
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});