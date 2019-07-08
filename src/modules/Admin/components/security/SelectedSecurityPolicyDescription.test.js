import SelectedSecurityPolicyDescription from './SelectedSecurityPolicyDescription';

const setup = (testProps, isShallow = true) => {
    const props = {
        title: 'test',
        ...testProps,
    };
    return getElement(SelectedSecurityPolicyDescription, props, isShallow);
};

describe('SelectedSecurityPolicyDescription component', () => {
    it('should render properly', () => {
        const wrapper = setup({
            selectedPolicyKey: 2,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
