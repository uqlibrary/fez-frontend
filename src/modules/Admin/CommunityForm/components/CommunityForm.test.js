import CommunityForm from './CommunityForm';
// import Immutable from 'immutable';
import React from 'react';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('modules/SharedComponents/Toolbox/ReactHookForm', () => ({
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

function setup(testProps) {
    return render(
        <WithReduxStore>
            <WithRouter>
                <CommunityForm {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Community form', () => {
    it('should render form', () => {
        const { container } = setup({});
        // expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(4);
        expect(container.getElementsByTagName('button').length).toEqual(2);
    });

    it('should not disable submit button if form submit has failed', () => {
        const { container, getByRole } = setup({ submitFailed: true });
        expect(container.getElementsByTagName('button').length).toEqual(2);
        expect(getByRole('button', { name: 'Add community' })).toBeEnabled();
    });

    it('should display successfull submission screen', () => {
        const { container } = setup({ submitSucceeded: true });
        expect(container).toMatchSnapshot();
    });
});

describe('Collection form redirections', () => {
    const { location } = window;

    beforeAll(() => {
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };
    });

    afterAll(() => {
        window.location = location;
    });

    it('should redirect to cancel page', () => {
        const { getByTestId } = setup({});
        fireEvent.click(getByTestId('cancel-community'));
        expect(window.location.assign).toBeCalledWith('/');
    });

    it('should redirect to after submit page', () => {
        const { getByRole } = setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
        fireEvent.click(getByRole('button', { name: 'Return to the homepage' }));
        expect(window.location.assign).toBeCalledWith('/');
    });

    it('should reload the page', () => {
        const { getByRole } = setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
        fireEvent.click(getByRole('button', { name: 'Add another community' }));
        expect(window.location.reload).toBeCalled();
    });
});
