import OverrideSecurity from './OverrideSecurity';

const setup = testProps => {
    const props = {
        label: 'test',
        overrideSecurityId: 'test',
        input: {
            onChange: jest.fn(),
        },
        ...testProps,
    };
    return getElement(OverrideSecurity, props);
};

describe('OverrideSecurity component', () => {
    it('should render properly', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
