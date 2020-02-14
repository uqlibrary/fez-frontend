import LicenceSelectorField from './LicenceSelectorField';

function setup(testProps = {}) {
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

    return getElement(LicenceSelectorField, props);
}

describe('LicenceSelectorField component', () => {
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

    it('should render with deprecated list', () => {
        const wrapper = setup({
            isAdmin: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
