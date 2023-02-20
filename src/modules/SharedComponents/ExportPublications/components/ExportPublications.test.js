import ExportPublications from './ExportPublications';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

function setup(testProps = {}) {
    const props = {
        format: testProps.format,
        ...testProps,
    };
    return getElement(ExportPublications, props);
}

describe('ExportPublications component', () => {
    it('renders with expected fields', () => {
        const wrapper = setup();
        expect(wrapper.find('ForwardRef(Select)').length).toBe(1);
        expect(wrapper.find('ForwardRef(MenuItem)').length).toBe(3);
        [-1, ...Object.keys(EXPORT_FORMAT_TO_EXTENSION)].forEach((value, index) => {
            expect(wrapper.find('ForwardRef(MenuItem)').get(index).props.value).toBe(value);
        });
    });

    it('calls callback when selection changes', () => {
        const expected = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const mockOnChange = jest.fn();
        const wrapper = setup({ onChange: mockOnChange });
        wrapper.find('ForwardRef(Select)').simulate('change', { target: { value: expected } });
        expect(mockOnChange.mock.calls.length).toBe(1);
    });

    it('renders with disabled fields', () => {
        const wrapper = setup({ disabled: true });
        expect(wrapper.find('ForwardRef(Select)').props().disabled).toEqual(true);
    });

    it('renders with given data', () => {
        const wrapper = setup({ exportData: { format: [{ label: 'excel', value: 'excel' }] } });
        expect(wrapper.find('ForwardRef(Select)').length).toBe(1);
        expect(wrapper.find('ForwardRef(MenuItem)').length).toBe(2);
        expect(wrapper.find('ForwardRef(MenuItem)').get(1).props.value).toBe('excel');
    });
});
