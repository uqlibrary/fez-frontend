import CommunityForm from './CommunityForm';
// import Immutable from 'immutable';
import React from 'react';
import { render, WithReduxStore, WithRouter, fireEvent, userEvent, waitFor, preview } from 'test-utils';

// /* eslint-disable react/prop-types */
// jest.mock('modules/SharedComponents/Toolbox/ReactHookForm', () => ({
//     Field: props => {
//         return (
//             <field
//                 is="mock"
//                 name={props.name}
//                 title={props.title}
//                 required={props.required}
//                 disabled={props.disabled}
//                 label={props.label || props.floatingLabelText}
//                 hasError={props.hasError}
//             />
//         );
//     },
// }));

function setup(testProps) {
    return render(
        <WithReduxStore>
            <WithRouter>
                <CommunityForm {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
}
async function inputText(getByTestId, settings) {
    for (const [testId, value] of settings) {
        const input = getByTestId(testId);
        await userEvent.click(input);
        await userEvent.type(input, value);
        await userEvent.tab();
        expect(input).toHaveValue(value);
    }
}

describe('Community form', () => {
    it('should render form', async () => {
        const { getByTestId } = setup({});
        await inputText(getByTestId, [
            ['rek-title-input', 'test'],
            ['rek-description-input', 'test'],
        ]);
        const submitButton = getByTestId('submit-community');
        await waitFor(() => expect(submitButton).toBeEnabled());
    });

    // it('should render form', () => {
    //     const { container } = setup({});
    //     preview.debug();
    //     // expect(container).toMatchSnapshot();
    //     expect(container.getElementsByTagName('field').length).toEqual(4);
    //     expect(container.getElementsByTagName('button').length).toEqual(2);
    // });
    // it('should not disable submit button if form submit has failed', () => {
    //     const { container, getByRole } = setup();
    //     expect(container.getElementsByTagName('button').length).toEqual(2);
    //     expect(getByRole('button', { name: 'Add community' })).toBeEnabled();
    // });
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
        expect(window.location.assign).toHaveBeenCalledWith('/');
    });

    // it('should redirect to after submit page', () => {
    //     const { getByRole } = setup({ submitSucceeded: true, newRecord: { rek_pid: 'UQ:12345' } });
    //     fireEvent.click(getByRole('button', { name: 'Return to the homepage' }));
    //     expect(window.location.assign).toHaveBeenCalledWith('/');
    // });

    // it('should reload the page', () => {
    //     const { getByRole } = setup();
    //     fireEvent.click(getByRole('button', { name: 'Add another community' }));
    //     expect(window.location.reload).toHaveBeenCalled();
    // });
});
