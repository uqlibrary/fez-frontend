import React from 'react';
import UpdateDialog from './UpdateDialog';
import { rtlRender, act, fireEvent, waitFor } from 'test-utils';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const defaultLocale = {
    cancelButtonLabel: 'test cancel',
    confirmButtonLabel: 'test confirm',
};

function setup(testProps = {}, renderer = rtlRender) {
    const { ...props } = testProps;

    return renderer(
        <UpdateDialog action="add" locale={defaultLocale} fields={{}} columns={{}} id="test" isOpen {...props} />,
    );
}

describe('UpdateDialog Renders component', () => {
    it('renders buttons only, when isOpen is false', () => {
        const actionFn = jest.fn();
        const cancelFn = jest.fn();
        const closeFn = jest.fn();
        const { getByTestId, getByText } = setup({
            title: 'Test title',
            onAction: actionFn,
            onCancelAction: cancelFn,
            onClose: closeFn,
        });

        expect(getByTestId('update_dialog-test')).toBeInTheDocument();
        expect(getByTestId('update_dialog-cancel-button')).toHaveTextContent('test cancel');
        expect(getByTestId('update_dialog-action-button')).toHaveTextContent('test confirm');
        expect(getByText('Test title')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('update_dialog-cancel-button'));
        });
        expect(cancelFn).toHaveBeenCalled();
        expect(closeFn).toHaveBeenCalled();
        act(() => {
            fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actionFn).toHaveBeenCalled();
        expect(closeFn).toHaveBeenCalledTimes(2);
    });

    it('renders simple Add form and returns values', async () => {
        const fields = {
            asset_id: {
                component: props => <TextField variant="standard" {...props} />,
                fieldParams: { canAdd: false },
            },
            asset_id_displayed: { component: props => <TextField variant="standard" {...props} />, fieldParams: {} },
            asset_type_name: { component: props => <TextField variant="standard" {...props} />, fieldParams: {} },
            asset_location: { component: props => <TextField variant="standard" {...props} />, fieldParams: {} },
            asset_status: {
                component: props => <FormControlLabel control={<Checkbox checked={false} {...props} />} />,
                fieldParams: { type: 'checkbox' }, // required for checkbox controls
            },
        };
        const columns = {
            asset_id: { label: 'ID' },
            asset_id_displayed: { label: 'Asset ID' },
            asset_type_name: { label: 'Type' },
            asset_location: { label: 'Location' },
            asset_status: { label: 'Status' },
        };
        const row = { asset_id: 'Test ID' };
        const actionFn = jest.fn();
        const { getByTestId, getByText, queryByTestId } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
            onAction: actionFn,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(queryByTestId('asset_id-input')).not.toBeInTheDocument(); // canAdd: false
        expect(getByText('Test ID')).toBeInTheDocument(); // canAdd: false, but still renders as text
        expect(getByTestId('asset_id_displayed-input')).toBeInTheDocument();
        expect(getByTestId('asset_type_name-input')).toBeInTheDocument();
        expect(getByTestId('asset_location-input')).toBeInTheDocument();
        expect(getByTestId('asset_status-input')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('asset_id_displayed-input'));
            fireEvent.change(getByTestId('asset_id_displayed-input'), { target: { value: 'Test 1' } });
            fireEvent.click(getByTestId('asset_type_name-input'));
            fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'Test 2' } });
            fireEvent.click(getByTestId('asset_location-input'));
            fireEvent.change(getByTestId('asset_location-input'), { target: { value: 'Test 3' } });
            fireEvent.click(getByTestId('asset_status-input'));
        });

        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('update_dialog-action-button'));
        });

        await waitFor(() =>
            expect(actionFn).toHaveBeenCalledWith({
                asset_id: 'Test ID',
                asset_id_displayed: 'Test 1',
                asset_type_name: 'Test 2',
                asset_location: 'Test 3',
                asset_status: true,
            }),
        );
    });

    it('doesnt render Add fields', async () => {
        const fields = {
            asset_id_displayed: {
                component: props => <TextField variant="standard" {...props} />,
                fieldParams: { renderInAdd: false },
            },
            asset_type_name: { component: props => <TextField variant="standard" {...props} />, fieldParams: {} },
        };
        const columns = {
            asset_id_displayed: { label: 'Asset ID' },
            asset_type_name: { label: 'Type' },
        };
        const row = { asset_id_displayed: 'Test ID displayed' };
        const actionFn = jest.fn();
        const { getByTestId, queryByTestId, getByText, queryByText } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
            onAction: actionFn,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(queryByTestId('asset_id_displayed-input')).not.toBeInTheDocument();
        expect(queryByText('Test ID displayed')).not.toBeInTheDocument(); // renderInAdd: false, wont render
        expect(getByTestId('asset_type_name-input')).toBeInTheDocument();
    });

    it('renders simple Edit form and returns values', async () => {
        const fields = {
            asset_id: {
                component: props => <TextField variant="standard" {...props} />,
                fieldParams: { canEdit: false },
            },
            asset_id_displayed: { component: props => <TextField variant="standard" {...props} />, fieldParams: {} },
            asset_type_name: { component: props => <TextField variant="standard" {...props} />, fieldParams: {} },
            asset_location: { component: props => <TextField variant="standard" {...props} />, fieldParams: {} },
            asset_status: { component: props => <TextField variant="standard" {...props} />, fieldParams: {} },
        };
        const columns = {
            asset_id: { label: 'ID' },
            asset_id_displayed: { label: 'Asset ID' },
            asset_type_name: { label: 'Type' },
            asset_location: { label: 'Location' },
            asset_status: { label: 'Status' },
        };
        const row = { asset_id: 'Test ID' };
        const actionFn = jest.fn();
        const { getByTestId, getByText, queryByTestId } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
            action: 'edit',
            onAction: actionFn,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(queryByTestId('asset_id-input')).not.toBeInTheDocument(); // canEdit: false
        expect(getByText('Test ID')).toBeInTheDocument(); // canEdit: false, but still renders as text
        expect(getByTestId('asset_id_displayed-input')).toBeInTheDocument();
        expect(getByTestId('asset_type_name-input')).toBeInTheDocument();
        expect(getByTestId('asset_location-input')).toBeInTheDocument();
        expect(getByTestId('asset_status-input')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('asset_id_displayed-input'));
            fireEvent.change(getByTestId('asset_id_displayed-input'), { target: { value: 'Test 1' } });
            fireEvent.click(getByTestId('asset_type_name-input'));
            fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'Test 2' } });
            fireEvent.click(getByTestId('asset_location-input'));
            fireEvent.change(getByTestId('asset_location-input'), { target: { value: 'Test 3' } });
            fireEvent.click(getByTestId('asset_status-input'));
            fireEvent.change(getByTestId('asset_status-input'), { target: { value: 'Test 4' } });
        });

        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('update_dialog-action-button'));
        });

        await waitFor(() =>
            expect(actionFn).toHaveBeenCalledWith({
                asset_id: 'Test ID',
                asset_id_displayed: 'Test 1',
                asset_type_name: 'Test 2',
                asset_location: 'Test 3',
                asset_status: 'Test 4',
            }),
        );
    });

    it('doesnt render Edit fields', () => {
        const fields = {
            asset_id_displayed: {
                component: props => <TextField variant="standard" {...props} />,
                fieldParams: { renderInUpdate: false },
            },
            asset_type_name: { component: props => <TextField variant="standard" {...props} />, fieldParams: {} },
        };
        const columns = {
            asset_id_displayed: { label: 'Asset ID' },
            asset_type_name: { label: 'Type' },
        };
        const row = { asset_id_displayed: 'Test ID displayed' };
        const actionFn = jest.fn();
        const { getByTestId, queryByTestId, getByText, queryByText } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
            action: 'edit',
            onAction: actionFn,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(queryByTestId('asset_id_displayed-input')).not.toBeInTheDocument();
        expect(queryByText('Test ID displayed')).not.toBeInTheDocument(); // renderInUpdate: false, wont render
        expect(getByTestId('asset_type_name-input')).toBeInTheDocument();
    });

    it('will fire computedValue function if available for Add', () => {
        const computeFunction = jest.fn(prop => `${prop} computed`);
        const fields = {
            asset_id_displayed: {
                fieldParams: { canAdd: false }, // needed for compute fields
                computedValue: computeFunction,
                computedValueProp: 'testProp', // note computedValue requires computedValueProp
            },
        };
        const columns = {
            asset_id_displayed: { label: 'Asset ID' },
        };
        const row = {};
        const { queryByTestId, getByText } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
            props: { testProp: 'This is a test prop' },
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(queryByTestId('asset_id_displayed-input')).not.toBeInTheDocument();
        expect(computeFunction).toHaveBeenCalledWith('This is a test prop');
        expect(getByText('This is a test prop computed')).toBeInTheDocument();
    });
    it('will fire computedValue function if available for Edit', () => {
        const computeFunction = jest.fn(prop => `${prop} computed`);
        const fields = {
            asset_id_displayed: {
                fieldParams: { canEdit: false }, // needed for compute fields
                computedValue: computeFunction,
                computedValueProp: 'testProp', // note computedValue requires computedValueProp
            },
        };
        const columns = {
            asset_id_displayed: { label: 'Asset ID' },
        };
        const row = {};
        const { queryByTestId, getByText } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
            action: 'edit',
            props: { testProp: 'This is a test prop' },
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(queryByTestId('asset_id_displayed-input')).not.toBeInTheDocument();
        expect(computeFunction).toHaveBeenCalledWith('This is a test prop');
        expect(getByText('This is a test prop computed')).toBeInTheDocument();
    });

    it('will fire valueFormatter function for static text', () => {
        const valueFormatterFn = jest.fn(prop => prop.split('/').join('-'));
        const fields = {
            asset_id_displayed: {
                fieldParams: { canAdd: false },
                valueFormatter: valueFormatterFn,
            },
        };
        const columns = {
            asset_id_displayed: { label: 'Asset ID' },
        };
        const row = { asset_id_displayed: '10/01/2001' };
        const { queryByTestId, getByText } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(queryByTestId('asset_id_displayed-input')).not.toBeInTheDocument();
        expect(valueFormatterFn).toHaveBeenCalledWith('10/01/2001');
        expect(getByText('10-01-2001')).toBeInTheDocument();
    });

    it('will fire valueFormatter function for fields', () => {
        const valueFormatterFn = jest.fn(prop => prop.split('/').join('-'));
        const fields = {
            asset_id_displayed: {
                component: props => <TextField variant="standard" {...props} />,
                fieldParams: {},
                valueFormatter: valueFormatterFn,
            },
        };
        const columns = {
            asset_id_displayed: { label: 'Asset ID' },
        };
        const row = { asset_id_displayed: '10/01/2001' };
        const { getByTestId, getByText } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(getByTestId('asset_id_displayed-input')).toHaveAttribute('value', '10-01-2001');
    });

    it('will fire validate function for fields', () => {
        let valid = true;
        const validateFn = jest.fn(() => {
            valid = !valid;
            return valid;
        });
        const fields = {
            asset_id_displayed: {
                component: props => <TextField variant="standard" {...props} />,
                fieldParams: {},
                validate: validateFn,
            },
        };
        const columns = {
            asset_id_displayed: { label: 'Asset ID' },
        };
        const row = {};
        const { getByTestId, getByText } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(validateFn).toHaveBeenCalled();

        expect(getByTestId('update_dialog-action-button')).toHaveAttribute('disabled');

        act(() => {
            fireEvent.click(getByTestId('asset_id_displayed-input'));
            fireEvent.change(getByTestId('asset_id_displayed-input'), { target: { value: 'Test 1' } });
        });

        expect(validateFn).toHaveBeenLastCalledWith('Test 1', { asset_id_displayed: 'Test 1' });
        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
    });

    it('shows spinner in action button when busy', () => {
        const fields = {
            asset_id_displayed: {
                component: props => <TextField variant="standard" {...props} />,
                fieldParams: {},
            },
        };
        const columns = {
            asset_id_displayed: { label: 'Asset ID' },
        };
        const row = {};
        const { getByTestId, getByText } = setup({
            title: 'Test title',
            isOpen: true,
            isBusy: true,
            fields,
            columns,
            row,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        // progress spinner isBusy: true,
        expect(getByTestId('update_dialog-progress')).toBeInTheDocument();
    });

    it('coverage', () => {
        const fields = {
            asset_id_displayed: {
                component: props => <TextField variant="standard" {...props} />,
                fieldParams: {},
            },
        };
        const columns = {
            asset_id_displayed: { label: 'Asset ID' },
        };
        const row = {};
        const { getByTestId, getByText, queryByTestId } = setup({
            title: 'Test title',
            isOpen: true,
            hideActionButton: true,
            hideCancelButton: true,
            noMinContentWidth: true,
            fields,
            columns,
            row,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        // hidden buttons hideActionButton: true, hideCancelButton: true,
        expect(queryByTestId('update_dialog-cancel-button')).not.toBeInTheDocument();
        expect(queryByTestId('update_dialog-action-button')).not.toBeInTheDocument();
        // auto width style noMinContentWidth: true,
        expect(getByTestId('update_dialog-test-content')).toHaveStyle('min-width: auto');
    });
});
