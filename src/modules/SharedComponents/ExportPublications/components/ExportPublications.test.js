import ExportPublications from './ExportPublications';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

function setup(testProps = {}) {
    const props = {
        format: testProps.format,
        ...testProps,
    };
    return getElement(ExportPublications, props);
}

describe('Export Publications renders', () => {
    it('component with all fields enabled', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('SelectField').length).toBe(1);
    });

    it('component with rendered field selected', () => {
        const expected = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const wrapper = setup({ format: expected });
        expect(toJson(wrapper)).toMatchSnapshot();
        // expect(wrapper.find('SelectField').props().value).toEqual(expected);
    });

    it('component with field selected', () => {
        const expected = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const mockOnChange = jest.fn();
        const wrapper = setup({ onChange: mockOnChange });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('WithStyles(ForwardRef(Select))').simulate('change', { target: { value: expected } });
        expect(mockOnChange.mock.calls.length).toBe(1);
    });

    it('component with all fields disabled', () => {
        const wrapper = setup({ disabled: true });
        wrapper.find('SelectField').forEach(option => {
            expect(option.props().disabled).toEqual(true);
        });
    });
});
