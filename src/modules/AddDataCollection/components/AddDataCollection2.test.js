import React from 'react';
import AddDataCollection, { licenseText } from './AddDataCollection';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, screen, preview } from 'test-utils';
import userEvent from '@testing-library/user-event';
// import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        resetForm: testProps.resetForm || jest.fn(),
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <AddDataCollection {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('AddDataCollection test', () => {
    beforeAll(() => {});
    afterAll(() => {
        // mockUseNavigate.mockClear();
    });
    it('should check doi error', async () => {
        mockApi.onAny().reply(config => {
            console.log(
                `Request made with method: ${config.method}, url: ${config.url}, params: ${JSON.stringify(
                    config.params,
                )}`,
            );
            return [200, {}];
        });

        // Re-import the component after resetting modules
        const { getByTestId } = setup();

        await userEvent.type(getByTestId('rek-doi-input'), 'Test');
        preview.debug();
        expect(getByTestId('rek-doi-input')).toHaveValue('Test');
    });
});
