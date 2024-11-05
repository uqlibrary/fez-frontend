import React from 'react';
import CollectionForm from './CollectionForm';
import Immutable from 'immutable';
import { render, WithReduxStore, WithRouter, fireEvent, act } from 'test-utils';
import { preview } from 'test-utils';
import { screen } from '@testing-library/react';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: props => {
        return (
            <field
                is="mock"
                name={props.name}
                title={props.title}
                required={props.required}
                disabled={props.disabled}
                label={props.label || props.floatingLabelText}
                hasError={props.hasError}
            />
        );
    },
}));

async function setup(testProps, testState) {
    const props = {
        disableSubmit: false,
        ...testProps,
    };

    const state = {
        communitiesReducer: {
            itemsList: [
                { rek_title: '<b>Community A</b>', rek_pid: '123' },
                { rek_title: '<i>Community B</i>', rek_pid: '456' },
            ],
        },
        ...testState,
    };

    let renderResult;
    await act(async () => {
        renderResult = render(
            <WithReduxStore initialState={Immutable.Map(state)}>
                <WithRouter>
                    <CollectionForm {...props} />
                </WithRouter>
            </WithReduxStore>,
        );
    });
    return renderResult;
}

describe('Collection form', () => {
    it('should render form with only the community dropdown', async () => {
        const { container, getAllByRole, getByTestId } = await setup({});
        expect(container).toMatchSnapshot();
        expect(getByTestId('rek-ismemberof-input')).toBeInTheDocument();
        expect(getAllByRole('button').length).toEqual(2);
    });

    it('should render success panel', async () => {
        const { container } = await setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
        expect(container).toMatchSnapshot();
    });

    it('should not disable submit button if form submit has failed', async () => {
        const { getByRole } = await setup({ submitFailed: true });
        expect(getByRole('button', { name: 'Add collection' })).not.toBeDisabled();
    });
});

describe('Collection form - redirections', () => {
    const { location } = window;

    beforeAll(() => {
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };
    });

    afterAll(() => {
        window.location = location;
    });

    it('should redirect to cancel page', async () => {
        const { getByRole } = await setup({});
        fireEvent.click(getByRole('button', { name: 'Return to the homepage' }));
        expect(window.location.assign).toBeCalledWith('/');
    });

    it('should redirect to after submit page', async () => {
        // Mock handleSubmit to control form submission outcome
        const mockHandleSubmit = jest.fn(cb => cb());
        const mockUseValidatedForm = jest.fn(() => ({
            handleSubmit: mockHandleSubmit,
            watch: jest.fn(),
            control: {},
            setError: jest.fn(),
            formState: { isSubmitting: false, isSubmitSuccessful: false, isDirty: false },
        }));
        const { getByRole } = await setup({ disableSubmit: false });
        preview.debug();
        fireEvent.click(getByRole('button', { name: 'Add another collection' }));
        expect(window.location.assign).toBeCalledWith('/');
    });

    it('should reload the page', async () => {
        const { getByRole } = await setup({ submitSucceeded: true, newRecord: {} });
        fireEvent.click(getByRole('button', { name: 'Return to the homepage' }));
        expect(window.location.reload).toBeCalled();
    });
});

describe('Collection form - autofill', () => {
    it('should render without dropdown if params exist', async () => {
        window.history.pushState({}, 'Test Title', '?pid=10&name=test');
        const { queryByTestId, getByTestId } = await setup({});
        expect(queryByTestId('community-selector')).not.toBeInTheDocument();

        expect(getByTestId('rek-title-input')).toBeInTheDocument();
        expect(getByTestId('rek-description-input')).toBeInTheDocument();
        expect(getByTestId('rek-keywords-input')).toBeInTheDocument();
        expect(getByTestId('internalNotes')).toBeInTheDocument();
        expect(getByTestId('cancel-collection')).toBeInTheDocument();
        expect(getByTestId('submit-collection')).toBeInTheDocument();
    });
});
