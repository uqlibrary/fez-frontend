import LicenseSelectorField from './LicenseSelectorField';

function setup(testProps = {}, isShallow = true) {
    const props = {
        label: 'License selector field',
        input: {
            value: ['test', 'test1'],
            onChange: jest.fn(),
        },
        errorText: '',
        error: false,
        ...testProps,
    };

    return getElement(LicenseSelectorField, props, isShallow);
}

describe('LicenseSelectorField component', () => {
    it('should render default view', () => {
        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error and error message', () => {
        const wrapper = setup({
            meta: {
                error: 'This field is required',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
