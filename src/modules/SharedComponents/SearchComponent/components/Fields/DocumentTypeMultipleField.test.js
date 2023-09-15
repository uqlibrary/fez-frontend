import React from 'react';
import { DocumentTypeMultipleField, styles } from './DocumentTypeMultipleField';
import { rtlRender, fireEvent, within } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        docTypes: [],
        updateDocTypeValues: jest.fn(),
        className: 'document-type-field',
        disabled: false,
        classes: {},
        ...testProps,
    };

    return rtlRender(<DocumentTypeMultipleField {...props} />);
}

describe('DocumentTypeMultipleField component', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const { container, getByTestId } = setup({ disabled: true });
        expect(container).toMatchSnapshot();
        expect(getByTestId('document-type-selector')).toHaveClass('Mui-disabled');
        expect(within(getByTestId('document-type-selector')).getByRole('button')).toHaveAttribute(
            'aria-disabled',
            'true',
        );
    });

    it('should render with given document types selected by default', () => {
        const defaultDocTypes = [371, 316];
        const { container, getByTestId, getByRole } = setup({
            docTypes: defaultDocTypes,
        });
        expect(container).toMatchSnapshot();
        fireEvent.mouseDown(within(getByTestId('document-type-selector')).getByRole('button'));
        expect(getByRole('option', { name: 'Design' })).toHaveAttribute('aria-selected', 'true');
        expect(getByRole('option', { name: 'Data Collection' })).toHaveAttribute('aria-selected', 'true');
    });

    it('should handle doc type change event', () => {
        const updateDocTypeValuesFn = jest.fn();
        const { getByTestId, getByRole } = setup({
            updateDocTypeValues: updateDocTypeValuesFn,
        });
        fireEvent.mouseDown(within(getByTestId('document-type-selector')).getByRole('button'));
        fireEvent.click(getByRole('option', { name: 'Design' }));

        expect(updateDocTypeValuesFn).toHaveBeenCalledWith([316]);
    });

    it('should have a proper style generator', () => {
        const theme = {
            typography: {
                caption: 'test1',
            },
            palette: {
                accent: {
                    main: 'test2',
                },
                white: {
                    main: 'test3',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette.accent;
        delete theme.palette.white;
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette;
        expect(styles(theme)).toMatchSnapshot();
    });

    it('should have the value "0" if docTypes property is empty', () => {
        const { container } = setup({
            docTypes: null,
        });
        expect(container.querySelector('input[name="document-type-selector"]').value).toStrictEqual('0');
    });
});
