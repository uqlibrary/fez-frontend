import React from 'react';
import ExportPublications from './ExportPublications';
import locale from 'locale/components';
import { fireEvent, rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        format: testProps.format,
        ...testProps,
    };
    return rtlRender(<ExportPublications {...props} />);
}

describe('ExportPublications component', () => {
    it('renders with expected fields', () => {
        const { getByTestId, getAllByRole } = setup();
        fireEvent.mouseDown(getByTestId('export-publications-format-select'));
        const options = getAllByRole('option');
        [{ label: 'Please select' }, ...locale.components.export.format].forEach((format, index) => {
            expect(options[index]).toHaveTextContent(format.label);
        });
    });

    it('calls callback when selection changes', () => {
        const onChangeFn = jest.fn();
        const format = locale.components.export.format[0];
        const { getByTestId, getByText } = setup({ onChange: onChangeFn });
        fireEvent.mouseDown(getByTestId('export-publications-format-select'));
        fireEvent.click(getByText(format.label));
        expect(onChangeFn).toBeCalledWith(format.value);
    });

    it('renders with disabled fields', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('export-publications-format-input')).toBeDisabled();
    });

    it('renders with given data', () => {
        const { getByTestId, getAllByRole } = setup({ exportData: { format: [{ label: 'excel', value: 'excel' }] } });
        fireEvent.mouseDown(getByTestId('export-publications-format-select'));
        const options = getAllByRole('option');
        expect(options.length).toBe(2);
        expect(options[1]).toHaveTextContent('excel');
    });
});
