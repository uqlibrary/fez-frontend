import CommunityForm from './CommunityForm';
// import Immutable from 'immutable';
import React from 'react';
import { render, WithReduxStore, WithRouter, fireEvent, userEvent, waitFor, preview } from 'test-utils';
import * as actions from 'actions';
import { useDispatch } from 'react-redux';
import { default as formLocale } from 'locale/publicationForm';
const txt = formLocale.addACommunity;

jest.mock('actions', () => ({
    ...jest.requireActual('actions'), // Retain the actual implementations of other functions
    createCommunity: jest.fn(),
}));

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
    beforeAll(() => {
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };
    });

    afterAll(() => {
        window.location = location;
    });

    it('should render form', async () => {
        actions.createCommunity
            .mockImplementationOnce(() => {
                console.log('run 1');
                return () => Promise.reject(new Error('test'));
            })
            .mockImplementationOnce(() => {
                console.log('run 2');
                return () => Promise.resolve();
            });

        const { getByTestId, getByRole } = setup({});
        await inputText(getByTestId, [
            ['rek-title-input', 'test'],
            ['rek-description-input', 'test'],
        ]);
        const submitButton = getByTestId('submit-community');
        await waitFor(() => expect(submitButton).toBeEnabled());

        await userEvent.click(submitButton);
        await waitFor(() => expect(getByTestId('api-error-alert')).toBeInTheDocument());
        await userEvent.click(submitButton);
        await waitFor(() => expect(getByRole('button', { name: /return to the homepage/i })).toBeInTheDocument());
        await userEvent.click(getByRole('button', { name: /return to the homepage/i }));

        expect(window.location.assign).toHaveBeenCalledWith('/');
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

    // it('should set currentAuthor to null when author is undefined', async () => {
    //     const mockDispatch = jest.fn();
    //     jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    //     jest.spyOn(require('react-redux'), 'useSelector').mockImplementation(selector =>
    //         selector === authorSelector ? null : selector,
    //     );

    //     const { getByRole } = setup();

    //     fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Community' } });
    //     fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test description' } });
    //     fireEvent.click(getByRole('button', { name: /add community/i }));

    //     await waitFor(() => {
    //         expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'CREATE_COMMUNITY' }));
    //     });
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
