import React from 'react';
import GrantListEditor from './GrantListEditor';
import { render as defaultRender, fireEvent, within } from 'test-utils';
import { FormProvider } from 'react-hook-form';

const mockSetValue = jest.fn();

function setup(testProps = {}, render = defaultRender) {
    const props = {
        disabled: false,
        state: {},
        locale: {},
        required: true,
        ...testProps,
        value: { items: testProps.value },
    };
    return render(
        <FormProvider setValue={mockSetValue}>
            <GrantListEditor {...props} />
        </FormProvider>,
    );
}

describe('GrantListEditor', () => {
    const grants = [
        { grantAgencyName: 'Test 1', grantId: '123', grantAgencyType: 'Testing 1' },
        { grantAgencyName: 'Test 2', grantId: '456', grantAgencyType: 'Testing 2' },
    ];

    beforeEach(() => jest.resetAllMocks());

    it('should render with default state', () => {
        const { getByTestId, queryByTestId } = setup();
        expect(getByTestId('rek-grant-agency-input')).toBeInTheDocument();
        expect(getByTestId('rek-grant-id-input')).toBeInTheDocument();
        expect(queryByTestId('rek-grant-list')).not.toBeInTheDocument();
    });

    it('should render given list', () => {
        const { getByTestId } = setup({ name: 'test', value: grants });
        const list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(list).toHaveLength(2);
    });

    it('should render error from state', () => {
        const { getByText } = setup({ state: { error: 'Test error' } });
        expect(getByText('Test error')).toBeInTheDocument();
    });

    it('should add a grant to an empty list', () => {
        const { getByTestId, getByRole, getByLabelText } = setup({ name: 'test' });

        fireEvent.change(getByRole('textbox', { name: 'Funder/Sponsor name' }), { target: { value: 'Agency' } });
        fireEvent.change(getByRole('textbox', { name: 'Grant ID' }), { target: { value: 'G-001' } });
        fireEvent.mouseDown(getByLabelText('Funder/Sponsor type'));
        fireEvent.click(getByRole('option', { name: 'Government' }));
        fireEvent.click(getByRole('button', { name: 'Add grant' }));

        const list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(list).toHaveLength(1);
        expect(mockSetValue).toHaveBeenCalledWith(
            'test',
            { items: [{ grantAgencyName: 'Agency', grantId: 'G-001', grantAgencyType: '453985' }] },
            { shouldValidate: true },
        );
    });

    it('should add a grant to the list', () => {
        const { getByTestId, getByRole, getByLabelText } = setup({ name: 'test', value: grants });

        fireEvent.change(getByRole('textbox', { name: 'Funder/Sponsor name' }), { target: { value: 'Agency' } });
        fireEvent.change(getByRole('textbox', { name: 'Grant ID' }), { target: { value: 'G-001' } });
        fireEvent.mouseDown(getByLabelText('Funder/Sponsor type'));
        fireEvent.click(getByRole('option', { name: 'Government' }));
        fireEvent.click(getByRole('button', { name: 'Add grant' }));

        const list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(list).toHaveLength(3);
        expect(mockSetValue).toHaveBeenCalledWith(
            'test',
            { items: [...grants, { grantAgencyName: 'Agency', grantId: 'G-001', grantAgencyType: '453985' }] },
            { shouldValidate: true },
        );
    });

    it('should edit a selected grant and update the list', () => {
        const { getByTestId, getByRole } = setup({ canEdit: true, name: 'test', value: grants });

        let list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(list[1]).getByRole('button', { name: 'Edit this entry' }));
        fireEvent.change(getByTestId('rek-grant-agency-input'), { target: { value: 'Updated Agency' } });
        fireEvent.click(getByRole('button', { name: 'Edit grant' }));

        list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(within(list[1]).getByText('Updated Agency')).toBeInTheDocument();
    });

    it('should move a grant up and down', () => {
        const { getByTestId } = setup({ name: 'test', value: grants });

        let list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(within(list[0]).getByText('Test 1')).toBeInTheDocument();

        fireEvent.click(within(list[1]).getByRole('button', { name: 'Move entry up the order' }));
        list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(within(list[0]).getByText('Test 2')).toBeInTheDocument();

        fireEvent.click(within(list[0]).getByRole('button', { name: 'Move entry down the order' }));
        list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(within(list[0]).getByText('Test 1')).toBeInTheDocument();
    });

    it('should not move up when previous entry is disabled', () => {
        const { getByTestId } = setup({
            name: 'test',
            value: [
                { grantAgencyName: 'Test 1', grantId: '123', grantAgencyType: 'Testing 1', disabled: true },
                { grantAgencyName: 'Test 2', grantId: '456', grantAgencyType: 'Testing 2' },
            ],
        });

        const list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(list[1]).getByRole('button', { name: 'Move entry up the order' }));

        const updatedList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(within(updatedList[0]).getByText('Test 1')).toBeInTheDocument();
        expect(within(updatedList[1]).getByText('Test 2')).toBeInTheDocument();
    });

    it('should delete a grant', () => {
        const { getByTestId, queryByText } = setup({ name: 'test', value: grants });

        const list = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(list[0]).getByRole('button', { name: 'Remove this entry' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));

        expect(queryByText('Test 1')).not.toBeInTheDocument();
        expect(queryByText('Test 2')).toBeInTheDocument();
    });

    it('should delete all grants', () => {
        const { getByTestId, getByRole, queryByTestId } = setup({ name: 'test', value: grants });

        fireEvent.click(getByRole('button', { name: 'Remove all entries' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));

        expect(queryByTestId('rek-grant-list')).not.toBeInTheDocument();
        expect(mockSetValue).toHaveBeenCalledWith('test', { items: [] }, { shouldValidate: true });
    });

    it('should apply scroll style when more than 3 grants', () => {
        const { getByTestId } = setup({
            name: 'test',
            value: [
                { grantAgencyName: 'Test 1', grantId: '123', grantAgencyType: 'Testing 1' },
                { grantAgencyName: 'Test 2', grantId: '456', grantAgencyType: 'Testing 2' },
                { grantAgencyName: 'Test 3', grantId: '789', grantAgencyType: 'Testing 3' },
                { grantAgencyName: 'Test 4', grantId: '000', grantAgencyType: 'Testing 4' },
            ],
        });
        expect(getByTestId('rek-grant-list')).toHaveStyle({ overflowY: 'scroll' });
    });
});
