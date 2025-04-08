import React from 'react';
import GrantListEditor from './GrantListEditor';
import { rtlRender, fireEvent, within } from 'test-utils';
import { FormProvider } from 'react-hook-form';

const mockSetValue = jest.fn();
function setup(testProps = {}) {
    const props = {
        disabled: false,
        meta: {},
        onChange: jest.fn(),
        locale: {},
        required: true,
        hideType: false,
        ...testProps,
    };
    return rtlRender(
        <FormProvider setValue={mockSetValue}>
            <GrantListEditor {...props} />
        </FormProvider>,
    );
}

describe('GrantListEditor', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render with default given value', () => {
        const { container } = setup({
            name: 'TestField',
            value: [
                {
                    grantAgencyName: 'Testing',
                    grantId: '1234',
                    grantAgencyType: 'Test',
                },
            ],
            locale: {
                form: {},
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error from props', () => {
        const { container } = setup({
            meta: {
                error: <span>Some error</span>,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error from props as children', () => {
        const { container } = setup({
            meta: {
                error: (
                    <p>
                        <span>Test error 1</span>
                        <span>Test error 2</span>
                    </p>
                ),
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render string error from props', () => {
        const { container } = setup({
            meta: {
                error: 'Test error',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render with default given value is List', () => {
        const { container } = setup({
            name: 'TestField',
            value: [
                {
                    grantAgencyName: 'Testing',
                    grantId: '1234',
                    grantAgencyType: 'Test',
                },
            ],
        });
        expect(container).toMatchSnapshot();
    });

    it('should update on receiving new props', () => {
        const value = {
            grantAgencyName: 'Testing',
            grantId: '1234',
            grantAgencyType: 'Test',
        };
        let props = {
            name: 'TestField',
            value: [value],
        };
        const { container, rerender } = setup(props);
        expect(container).toMatchSnapshot();

        props = {
            classes: {},
            name: 'TestField',
            value: [value],
        };

        rerender(<GrantListEditor {...props} />);
        expect(mockSetValue).toHaveBeenCalledWith('TestField', [], { shouldValidate: true });
        expect(mockSetValue).toHaveBeenCalledWith('TestField', [value], { shouldValidate: true });
    });

    it('should add grant to the list', () => {
        const { getByRole, getByLabelText, container } = setup();

        fireEvent.change(getByRole('textbox', { name: 'Funder/Sponsor name' }), { target: { value: 'Test' } });
        fireEvent.change(getByRole('textbox', { name: 'Grant ID' }), { target: { value: '123' } });
        fireEvent.mouseDown(getByLabelText('Funder/Sponsor type'));
        fireEvent.click(getByRole('option', { name: 'Government' }));
        fireEvent.click(getByRole('button', { name: 'Add grant' }));

        expect(container).toMatchSnapshot();
    });

    it('should render scroll class if grants are more than 3', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const grant3 = {
            grantAgencyName: 'Test 3',
            grantId: '456',
            grantAgencyType: 'Testing 3',
        };

        const grant4 = {
            grantAgencyName: 'Test 4',
            grantId: '456',
            grantAgencyType: 'Testing 4',
        };

        const { container } = setup({
            name: 'test',
            value: [grant1, grant2, grant3, grant4],
            classes: {
                scroll: 'scroll-class',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should move the grant up', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [grant1, grant2],
        });
        expect(container).toMatchSnapshot();

        let grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(grantList.length).toEqual(2);
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Move entry up the order' }));
        grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Move entry up the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should not move the grant up at index 0', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [grant1],
        });
        expect(container).toMatchSnapshot();

        const grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[0]).getByRole('button', { name: 'Move entry up the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should not move the grant up the disabled grant', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
            disabled: true,
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [grant1, grant2],
        });
        expect(container).toMatchSnapshot();

        const grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Move entry up the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should move the grant down', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [grant1, grant2],
        });
        expect(container).toMatchSnapshot();

        const grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[0]).getByRole('button', { name: 'Move entry down the order' }));
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Move entry down the order' }));

        expect(container).toMatchSnapshot();
    });

    it('should delete grant', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, container } = setup({
            name: 'test',
            value: [grant1, grant2],
        });
        expect(container).toMatchSnapshot();

        const grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[0]).getByRole('button', { name: 'Remove this entry' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));

        expect(container).toMatchSnapshot();
    });

    it('should delete all grants', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByRole, getByTestId, container } = setup({
            name: 'test',
            value: [grant1, grant2],
        });
        expect(container).toMatchSnapshot();
        fireEvent.click(getByRole('button', { name: 'Remove all entries' }));
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(container).toMatchSnapshot();
    });

    it('should edit selected grant correctly', () => {
        const grant1 = {
            grantAgencyName: 'Test 1',
            grantId: '123',
            grantAgencyType: 'Testing 1',
        };

        const grant2 = {
            grantAgencyName: 'Test 2',
            grantId: '456',
            grantAgencyType: 'Testing 2',
        };

        const { getByTestId, getByRole } = setup({
            canEdit: true,
            name: 'test',
            value: [grant1, grant2],
        });

        let grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        fireEvent.click(within(grantList[1]).getByRole('button', { name: 'Edit this entry' }));
        fireEvent.change(getByTestId('rek-grant-agency-input'), { target: { value: 'Agency 2' } });
        fireEvent.click(getByRole('button', { name: 'Edit grant' }));

        grantList = within(getByTestId('rek-grant-list')).getAllByRole('listitem');
        expect(within(grantList[1]).getByText('Agency 2')).toBeInTheDocument();
    });

    it('should call setValue on state change', () => {
        const mockOnChange = jest.fn();
        const mockSetValue = jest.fn();
        jest.spyOn(require('react-hook-form'), 'useFormContext').mockReturnValue({ setValue: mockSetValue });

        const inputName = 'my-input';
        const { getByRole } = setup({
            onChange: mockOnChange,
            name: inputName,
        });

        fireEvent.change(getByRole('textbox', { name: 'Funder/Sponsor name' }), { target: { value: 'Test' } });
        expect(mockOnChange).not.toHaveBeenCalledWith(true);
        expect(mockOnChange).not.toHaveBeenCalledWith([]);
        expect(mockSetValue).toHaveBeenCalledWith(inputName, true, { shouldValidate: true });
        expect(mockSetValue).toHaveBeenCalledWith(inputName, [], { shouldValidate: true });
    });
});
