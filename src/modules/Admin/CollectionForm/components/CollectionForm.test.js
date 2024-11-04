import React from 'react';
import CollectionForm from './CollectionForm';
import Immutable from 'immutable';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';
import { preview } from 'test-utils';

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

function setup(testProps, testState) {
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

    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <WithRouter>
                <CollectionForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Collection form', () => {
    it('should render form with only the community dropdown', () => {
        const { container, getAllByRole, getByTestId } = setup({});
        expect(container).toMatchSnapshot();
        expect(getByTestId('rek-ismemberof-input')).toBeInTheDocument();
        expect(getAllByRole('button').length).toEqual(2);
    });

    it('should render the full form', () => {
        const { container, getAllByRole, getByTestId } = setup({});

        // expect(container).toMatchSnapshot();
        getByTestId('rek-ismemberof-input').value = 123;
        preview.debug();
        expect(getByTestId('rek-ismemberof-input')).toBeInTheDocument();
        expect(getByTestId('rek-title-input')).toBeInTheDocument();
        expect(getByTestId('rek-description-input')).toBeInTheDocument();
        expect(getByTestId('rek-keywords-input')).toBeInTheDocument();
        expect(getByTestId('internalNotes')).toBeInTheDocument();
        expect(getAllByRole('button').length).toEqual(2);
    });

    it('should render success panel', () => {
        const { container } = setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
        expect(container).toMatchSnapshot();
    });

    it('should not disable submit button if form submit has failed', () => {
        const { getByRole } = setup({ submitFailed: true });
        expect(getByRole('button', { name: 'Add collection' })).not.toBeDisabled();
    });

    it('should ask when redirecting from form with data (even if submit failed)', () => {
        const render = renderComponent(CollectionForm, {
            formValues: Immutable.Map({}),
            dirty: true,
            submitSucceeded: false,
        });

        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should not ask when redirecting from form with data after successful submit', () => {
        const render = renderComponent(CollectionForm, {
            formValues: Immutable.Map({}),
            dirty: true,
            submitSucceeded: true,
        });

        expect(render.getRenderOutput()).toMatchSnapshot();
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

    it('should redirect to cancel page', () => {
        const { getByRole } = setup({});
        fireEvent.click(getByRole('button', { name: 'Return to the homepage' }));
        expect(window.location.assign).toBeCalledWith('/');
    });

    it('should redirect to after submit page', () => {
        const { getByRole } = setup({ submitSucceeded: true, newRecord: {} });
        fireEvent.click(getByRole('button', { name: 'Add another collection' }));
        expect(window.location.assign).toBeCalledWith('/');
    });

    it('should reload the page', () => {
        const { getByRole } = setup({ submitSucceeded: true, newRecord: {} });
        fireEvent.click(getByRole('button', { name: 'Return to the homepage' }));
        expect(window.location.reload).toBeCalled();
    });
});

describe('Collection form - autofill', () => {
    it('should render without dropdown if params exist', () => {
        window.history.pushState({}, 'Test Title', '?pid=10&name=test');
        const { queryByTestId } = setup({});
        expect(queryByTestId('community-selector')).not.toBeInTheDocument();
    });
});
