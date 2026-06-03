import React from 'react';
import GrantListEditorForm from './GrantListEditorForm';
import { render, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onAdd: jest.fn(),
        onDirty: jest.fn(),
        disabled: false,
        required: true,
        ...testProps,
    };
    return render(<GrantListEditorForm {...props} />);
}

describe('GrantListEditorForm', () => {
    beforeEach(() => jest.resetAllMocks());

    it('should render all fields and description', () => {
        const { getByTestId, getByText, queryByTestId, unmount } = setup();
        expect(
            getByText(
                "Add the Funder/Sponsor's name, grant ID and type - then click the ADD GRANT button to add each to the list",
            ),
        ).toBeInTheDocument();
        expect(getByTestId('rek-grant-agency-input')).toBeInTheDocument();
        expect(getByTestId('rek-grant-id-input')).toBeInTheDocument();
        expect(getByTestId('rek-grant-type-select')).toBeInTheDocument();
        unmount();

        // hideType hides the type field
        setup({ hideType: true });
        expect(queryByTestId('rek-grant-type-select')).not.toBeInTheDocument();
    });

    it('should show required error on agency name when required and empty, or when dirty with empty name', () => {
        // required=true, empty name -> error shown
        const { queryByTestId, queryByText, unmount } = setup({ required: true });
        expect(queryByTestId('rek-grant-agency-helper-text')).toBeInTheDocument();
        expect(queryByText('This field is required')).toBeInTheDocument();
        unmount();

        // required=false, dirty via grantId only -> error shown
        setup({ required: false });
        expect(queryByTestId('rek-grant-agency-helper-text')).not.toBeInTheDocument();
        expect(queryByText('This field is required')).not.toBeInTheDocument();

        fireEvent.change(queryByTestId('rek-grant-id-input'), { target: { name: 'grantId', value: '123' } });
        expect(queryByTestId('rek-grant-agency-helper-text')).toBeInTheDocument();
        expect(queryByText('This field is required')).toBeInTheDocument();
    });

    it('should show agency type error when agency name is set but type is empty', () => {
        const { getByTestId, getByText } = setup({ required: false });
        fireEvent.change(getByTestId('rek-grant-agency-input'), {
            target: { name: 'grantAgencyName', value: 'Agency' },
        });
        expect(getByTestId('rek-grant-agency-helper-text')).toBeInTheDocument();
        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should call onDirty(true) when form is changed and onDirty(false) when reset to default', () => {
        const onDirty = jest.fn();
        const { getByTestId } = setup({ onDirty, required: false });

        expect(onDirty).toHaveBeenCalledWith(false);

        fireEvent.change(getByTestId('rek-grant-agency-input'), { target: { name: 'grantAgencyName', value: 'test' } });
        expect(onDirty).toHaveBeenLastCalledWith(true);

        fireEvent.change(getByTestId('rek-grant-agency-input'), { target: { name: 'grantAgencyName', value: '' } });
        expect(onDirty).toHaveBeenLastCalledWith(false);
    });

    it('should not throw when onDirty is not provided', () => {
        expect(() => {
            const { getByTestId } = setup({ onDirty: undefined });
            fireEvent.change(getByTestId('rek-grant-agency-input'), {
                target: { name: 'grantAgencyName', value: 'test' },
            });
        }).not.toThrow();
    });

    it('should call onAdd and reset the form when Add grant is clicked', () => {
        const onAdd = jest.fn();
        const onDirty = jest.fn();
        const { getByTestId, getByText, getByRole } = setup({ onAdd, onDirty });

        fireEvent.change(getByTestId('rek-grant-agency-input'), {
            target: { name: 'grantAgencyName', value: 'Agency' },
        });
        fireEvent.change(getByTestId('rek-grant-id-input'), { target: { name: 'grantId', value: 'G-001' } });
        fireEvent.mouseDown(getByTestId('rek-grant-type-select'));
        fireEvent.click(getByText('Government'));

        fireEvent.click(getByRole('button', { name: 'Add grant' }));

        expect(onAdd).toHaveBeenCalledWith({ grantAgencyName: 'Agency', grantId: 'G-001', grantAgencyType: '453985' });
        expect(onDirty).toHaveBeenLastCalledWith(false);
        expect(getByTestId('rek-grant-agency-input')).toHaveAttribute('value', '');
        expect(getByTestId('rek-grant-id-input')).toHaveAttribute('value', '');
    });

    it('should load selected grant for editing and show Edit grant button', () => {
        const { getByTestId, getByRole } = setup({
            grantSelectedToEdit: { grantAgencyName: 'Agency', grantId: 'G-001', grantAgencyType: '453985' },
        });
        expect(getByTestId('rek-grant-agency-input')).toHaveAttribute('value', 'Agency');
        expect(getByTestId('rek-grant-id-input')).toHaveAttribute('value', 'G-001');
        expect(getByTestId('rek-grant-type-input')).toHaveAttribute('value', '453985');
        expect(getByRole('button', { name: 'Edit grant' })).toBeInTheDocument();
    });

    it('should map ORG_TYPE_NOT_SET to empty string when loading selected grant', () => {
        const { getByTestId } = setup({
            grantSelectedToEdit: { grantAgencyName: 'Agency', grantId: 'G-001', grantAgencyType: '454045' },
        });
        expect(getByTestId('rek-grant-type-input')).toHaveAttribute('value', '');
    });

    it('should not add when Enter is pressed without agency name, or missing type, or non-Enter key', () => {
        const onAdd = jest.fn();
        const { getByTestId } = setup({ onAdd });

        // Enter with no agency name -> no add
        fireEvent.keyDown(getByTestId('rek-grant-id-input'), { key: 'Enter', code: 13 });
        expect(onAdd).not.toHaveBeenCalled();

        // agency name set but type missing -> no add on Enter
        fireEvent.change(getByTestId('rek-grant-agency-input'), {
            target: { name: 'grantAgencyName', value: 'Agency' },
        });
        fireEvent.keyDown(getByTestId('rek-grant-id-input'), { key: 'Enter', code: 13 });
        expect(onAdd).not.toHaveBeenCalled();

        // non-Enter key -> no add
        fireEvent.keyDown(getByTestId('rek-grant-id-input'), { key: 'Esc', code: 27 });
        expect(onAdd).not.toHaveBeenCalled();
    });

    it('should disable Add grant button until agency name and type are set', () => {
        const { getByTestId, getByRole, getByText } = setup({ required: false });

        expect(getByRole('button', { name: 'Add grant' })).toBeDisabled();

        fireEvent.change(getByTestId('rek-grant-agency-input'), {
            target: { name: 'grantAgencyName', value: 'Agency' },
        });
        expect(getByRole('button', { name: 'Add grant' })).toBeDisabled();

        fireEvent.mouseDown(getByTestId('rek-grant-type-select'));
        fireEvent.click(getByText('Government'));
        expect(getByRole('button', { name: 'Add grant' })).not.toBeDisabled();
    });
});
