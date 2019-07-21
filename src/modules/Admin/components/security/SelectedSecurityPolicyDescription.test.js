import SelectedSecurityPolicyDescription from './SelectedSecurityPolicyDescription';

const setup = testProps => {
    const props = {
        title: 'test',
        ...testProps,
    };
    return getElement(SelectedSecurityPolicyDescription, props);
};

describe('SelectedSecurityPolicyDescription component', () => {
    it('should render properly', () => {
        const wrapper = setup({
            selectedPolicyKey: 2,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
