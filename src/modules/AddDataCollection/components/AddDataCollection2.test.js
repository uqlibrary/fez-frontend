import React from 'react';
import AddDataCollection, { licenseText } from './AddDataCollection';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, screen, preview } from 'test-utils';
import userEvent from '@testing-library/user-event';
// import * as actions from 'actions';
// import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import * as repository from 'repositories';

const mockUseNavigate = jest.fn();
// jest.mock('actions'); // Mock the `actions` module

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
        // const spy = jest.spyOn(actions, 'doesDOIExist');
        const existingDoiValue = '10.1037/a0028240';
        mockApi
            .onGet(repository.routes.SEARCH_KEY_LOOKUP_API({}).apiUrl, {
                params: { rule: 'lookup', search_key: 'doi', lookup_value: existingDoiValue },
            })
            .reply(config => {
                console.log(
                    `Request2 made with method: ${config.method}, url: ${config.url}, params: ${JSON.stringify(
                        config.params,
                    )}`,
                );
                return [200, { total: 1 }];
            });

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

        const doi = getByTestId('rek-doi-input');
        await userEvent.type(doi, 'Test');
        await userEvent.tab();
        expect(doi).toHaveValue('Test');
        await waitFor(() => expect(screen.getByText('DOI is not valid')).toBeInTheDocument());
        await userEvent.clear(doi);
        await userEvent.type(doi, existingDoiValue);
        await userEvent.tab();
        doi.blur();
        await waitFor(() => expect(screen.getByText('DOI is assigned to another work already')).toBeInTheDocument());
        // await new Promise(resolve => setTimeout(resolve, 2000));
        preview.debug();
        // await waitFor(() => expect(spy).toHaveBeenCalled());
    });
});
