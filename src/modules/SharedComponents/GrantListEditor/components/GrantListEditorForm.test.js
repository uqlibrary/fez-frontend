import React from 'react';
import GrantListEditorForm from './GrantListEditorForm';
import { render, fireEvent, rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onAdd: jest.fn(),
        errorText: null,
        disabled: false,
        required: true,
        hideType: false,
        isPopulated: testProps.isPopulated || jest.fn(),
        ...testProps,
    };
    return render(<GrantListEditorForm {...props} />);
}

describe('GrantListEditorForm', () => {
    it('should render with default props', () => {
        const { container } = rtlRender(<GrantListEditorForm onAdd={jest.fn()} isPopulated={jest.fn()} />);
        expect(container).toMatchSnapshot();
    });

    it('should render default view', () => {
        const { getByTestId, getByText } = setup();
        expect(
            getByText(
                "Add the Funder/Sponsor's name, grant ID and type - then click the ADD GRANT button to add each to the list",
            ),
        ).toBeInTheDocument();

        expect(getByTestId('rek-grant-type-select')).toBeInTheDocument();
    });

    it('should hide grant agency type input', () => {
        const { queryByTestId } = setup({ hideType: true });
        expect(queryByTestId('rek-grant-type-select')).not.toBeInTheDocument();
    });

    it('should set grant agency type as a required input if agency name is set', () => {
        const { getByTestId, getByText } = setup({ required: false });
        fireEvent.change(getByTestId('rek-grant-agency-input'), { target: { value: 'test' } });
        expect(getByTestId('rek-grant-agency-helper-text')).toBeInTheDocument();
        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should add grant and pass isPopulated info', () => {
        const onAddFn = jest.fn();
        const isPopulated = jest.fn();
        const { getByTestId, getByText } = setup({
            onAdd: onAddFn,
            isPopulated: isPopulated,
        });

        fireEvent.change(getByTestId('rek-grant-agency-input'), { target: { name: 'grantAgencyName', value: 'test' } });
        fireEvent.change(getByTestId('rek-grant-id-input'), { target: { name: 'grantId', value: '123' } });

        expect(isPopulated).toHaveBeenCalledTimes(2);
        expect(isPopulated).toHaveBeenCalledWith(true);

        fireEvent.mouseDown(getByTestId('rek-grant-type-select'));
        fireEvent.click(getByText('Government'));

        fireEvent.click(getByTestId('rek-grant-add'));

        expect(onAddFn).toHaveBeenCalledWith({
            grantAgencyName: 'test',
            grantId: '123',
            grantAgencyType: '453985',
        });

        expect(isPopulated).toHaveBeenCalledWith(false);
    });

    it('should not add grant if form state is not valid or any other key is pressed', () => {
        const onAddFn = jest.fn();
        const { getByTestId } = setup({ onAdd: onAddFn });

        fireEvent.change(getByTestId('rek-grant-id-input'), { target: { name: 'grantId', value: '123' } });
        fireEvent.keyDown(getByTestId('rek-grant-id-input'), { key: 'Enter', code: 13 });
        expect(onAddFn).not.toBeCalled();

        fireEvent.change(getByTestId('rek-grant-agency-input'), { target: { name: 'grantAgencyName', value: 'test' } });

        fireEvent.keyDown(getByTestId('rek-grant-id-input'), { key: 'Enter', code: 13 });
        expect(onAddFn).not.toBeCalled();

        fireEvent.keyDown(getByTestId('rek-grant-id-input'), { key: 'Esc', code: 27 });
        expect(onAddFn).not.toBeCalled();
    });

    it('should load form with selected grant information', () => {
        const { getByTestId } = setup({
            grantSelectedToEdit: {
                grantAgencyName: 'test',
                grantId: '123',
                grantAgencyType: '453985',
            },
        });

        expect(getByTestId('rek-grant-agency-input')).toHaveAttribute('value', 'test');
        expect(getByTestId('rek-grant-id-input')).toHaveAttribute('value', '123');
        expect(getByTestId('rek-grant-type-input')).toHaveAttribute('value', '453985');
    });

    it('should load form with selected grant information', () => {
        const { getByTestId } = setup({
            grantSelectedToEdit: {
                grantAgencyName: 'test',
                grantId: '123',
                grantAgencyType: '454045',
            },
        });

        expect(getByTestId('rek-grant-agency-input')).toHaveAttribute('value', 'test');
        expect(getByTestId('rek-grant-id-input')).toHaveAttribute('value', '123');
        expect(getByTestId('rek-grant-type-input')).toHaveAttribute('value', '');
    });
});
