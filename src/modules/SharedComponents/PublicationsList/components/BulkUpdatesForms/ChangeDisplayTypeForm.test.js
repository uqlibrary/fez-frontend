import React from 'react';
import ChangeDisplayTypeForm from './ChangeDisplayTypeForm';
import {
    act,
    render,
    WithRouter,
    WithReduxStore,
    fireEvent,
    waitFor,
    expectApiRequestToMatchSnapshot,
    api,
    assertDisabled,
    assertEnabled,
    expectRequiredFieldError,
    expectMissingRequiredFieldError,
} from 'test-utils';
import * as repositories from 'repositories';

function setup(testProps = {}) {
    const props = {
        recordsSelected: { 'UQ:123456': { rek_pid: 'UQ:123456' } },
        onCancel: jest.fn(),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <ChangeDisplayTypeForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('ChangeDisplayTypeForm', () => {
    const assertFormInitialState = async () => {
        // await waitForText(
        //     new RegExp(locale.components.bulkUpdates.bulkUpdatesForms.changeDisplayTypeForm.alert.message, 'i'),
        // );
        await expectRequiredFieldError('rek-display-type');
        await expectMissingRequiredFieldError('rek-subtype-select');
        assertDisabled('change-display-type-submit');
    };

    it('should correctly submit form and display success info', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
        const { getByTestId, getByText, queryByTestId } = setup();
        await assertFormInitialState();

        // interact with the form
        fireEvent.mouseDown(getByTestId('rek-display-type-select'));
        fireEvent.click(getByText('Book'));

        // assert next state of the form on display type selected (e.g. Book)
        await expectMissingRequiredFieldError('rek-display-type');
        expect(getByTestId('rek-subtype-select')).toBeInTheDocument();
        await expectRequiredFieldError('rek-subtype');
        assertDisabled('change-display-type-submit');

        fireEvent.mouseDown(getByTestId('rek-subtype-select'));
        fireEvent.click(getByText('Research book (original research)'));

        // assert next state of the form on display type selected (e.g. Research book)
        await expectMissingRequiredFieldError('rek-subtype');
        assertEnabled('change-display-type-submit');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('change-display-type-submit'));
        });

        await waitFor(() => getByTestId('alert-done-change-display-type'));
        expect(getByTestId('alert-done-change-display-type')).toBeInTheDocument();
        expectApiRequestToMatchSnapshot('patch', api.url.records.create);
    });

    it('should submit form and display error', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(500, {});
        const { getByTestId, getByText, queryByTestId } = setup();
        await assertFormInitialState();

        // interact with the form
        fireEvent.mouseDown(getByTestId('rek-display-type-select'));
        fireEvent.click(getByText('Book'));

        // assert next state of the form on display type selected (e.g. Book)
        await expectMissingRequiredFieldError('rek-display-type');
        expect(getByTestId('rek-subtype-select')).toBeInTheDocument();
        await expectRequiredFieldError('rek-subtype');
        assertDisabled('change-display-type-submit');

        fireEvent.mouseDown(getByTestId('rek-subtype-select'));
        fireEvent.click(getByText('Research book (original research)'));

        // assert next state of the form on display type selected (e.g. Research book)
        await expectMissingRequiredFieldError('rek-subtype');
        assertEnabled('change-display-type-submit');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('change-display-type-submit'));
        });

        await waitFor(() => getByTestId('alert-error-change-display-type'));
        expect(getByTestId('alert-error-change-display-type')).toBeInTheDocument();
    });
});
