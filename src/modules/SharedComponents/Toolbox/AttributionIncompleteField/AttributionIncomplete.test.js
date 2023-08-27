import React from 'react';
import { AttributionIncomplete, styles } from './AttributionIncomplete';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps) {
    const props = {
        isAttributionIncomplete: false,
        onChange: jest.fn(),
        classes: {
            label: '',
            error: '',
            accepted: '',
        },
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
    it('should have a proper style generator', () => {
        const theme = {
            status: {
                danger: 'test1',
            },
            palette: {
                primary: {
                    main: 'test2',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();

        delete theme.status;
        delete theme.palette;
        expect(styles(theme)).toMatchSnapshot();
    });
});
