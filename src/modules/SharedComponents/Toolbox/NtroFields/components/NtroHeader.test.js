import NtroHeader from './NtroHeader';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };
    return getElement(NtroHeader, props, isShallow);
}

describe('Component NtroHeader', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
