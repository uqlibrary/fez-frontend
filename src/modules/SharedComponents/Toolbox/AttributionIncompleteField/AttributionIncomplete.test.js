import React from 'react';
import { AttributionIncomplete } from './AttributionIncomplete';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps) {
    const props = {
        isAttributionIncomplete: false,
        onChange: jest.fn(),
        disabled: false,
        attributionIncompleteStatement: 'Test statement',
        attributionIncompleteDetail: 'Test detail',
        copyrightAgreement: 'test deposit agreement',
        ...testProps,
    };

    return rtlRender(<AttributionIncomplete {...props} />);
}

describe('Component AttributionIncomplete', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render checked if record is checked', () => {
        const { container } = setup({ isAttributionIncomplete: true });
        expect(container).toMatchSnapshot();
    });
    it('should call onChange to handle change with true', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({ onChange: testFn });
        fireEvent.click(getByRole('checkbox', { name: 'Test statement' }));
        expect(testFn).toHaveBeenCalledWith(true);
    });
    it('should call onChange to handle change with false', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({ isAttributionIncomplete: true, onChange: testFn });
        fireEvent.click(getByRole('checkbox', { name: 'Test statement' }));
        expect(testFn).toHaveBeenCalledWith(false);
    });
});
