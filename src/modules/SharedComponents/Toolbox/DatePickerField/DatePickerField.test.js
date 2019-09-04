import DatePickerField from './DatePickerField';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };
    return getElement(DatePickerField, props);
}

describe('DatePickerField snapshots tests', () => {
    it('renders component', () => {
        const wrapper = setup({
            input: {
                value: 0,
                onChange: jest.fn(),
            },
            meta: {
                error: 'error text',
            },
        });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders onchange when input not supplied', () => {
        const wrapper = setup({ onChange: jest.fn() });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
