import React from 'react';
import PublicationsList from './PublicationsList';
import { myRecordsList } from 'mock/data';
import { render, WithRouter, WithReduxStore, fireEvent } from 'test-utils';
import * as Context from 'context';
import * as Hooks from 'hooks/userIsAdmin';

function setup(testProps = {}) {
    const props = {
        publicationsList: testProps.publicationsList || [], // : PropTypes.array,
        customActions: testProps.customActions || [], // : PropTypes.array,
        showDefaultActions: testProps.showDefaultActions || false, // : PropTypes.bool
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <PublicationsList {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('PublicationsList', () => {
    it('renders empty component', () => {
        const { asFragment } = setup();
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders component with items', () => {
        const { asFragment } = setup({ publicationsList: myRecordsList.data });
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders component with custom subset actions', () => {
        const test = [];
        const { asFragment } = setup({
            publicationsList: [{ rek_pid: 'UQ:111111' }],
            publicationsListSubset: ['UQ:111111'],
            subsetCustomActions: test,
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render checkbox for each publication and render bulk updates actions on selecting records', () => {
        const useRecordsSelectorContext = jest.spyOn(Context, 'useRecordsSelectorContext');
        const userIsAdmin = jest.spyOn(Hooks, 'userIsAdmin');
        useRecordsSelectorContext.mockImplementation(() => ({
            records: myRecordsList.data,
        }));
        userIsAdmin.mockImplementation(() => true);
        const { getByTestId, queryByTestId } = setup({ publicationsList: myRecordsList.data });
        expect(queryByTestId('bulk-updates-actions-select')).not.toBeInTheDocument();
        expect(getByTestId('select-all-publications-input')).toBeInTheDocument();

        fireEvent.click(getByTestId('select-all-publications-input'));
        // waitFor(() => getByTestId('bulk-updates-actions-select'));
        expect(getByTestId('bulk-updates-actions-select')).toBeInTheDocument();
    });

    it('should render change display type form', () => {
        const userIsAdmin = jest.spyOn(Hooks, 'userIsAdmin');
        const useRecordsSelectorContext = jest.spyOn(Context, 'useRecordsSelectorContext');
        useRecordsSelectorContext.mockImplementation(() => ({
            records: myRecordsList.data,
        }));
        userIsAdmin.mockImplementation(() => true);

        const { getByTestId, getByText } = setup({ publicationsList: myRecordsList.data });

        fireEvent.click(getByTestId('select-publication-0-input'));
        fireEvent.mouseDown(getByTestId('bulk-updates-actions-select'));
        fireEvent.click(getByText('Change display type'));

        expect(getByTestId('change-display-type-form')).toBeInTheDocument();
    });

    it('should render change search key value form', () => {
        const userIsAdmin = jest.spyOn(Hooks, 'userIsAdmin');
        const useRecordsSelectorContext = jest.spyOn(Context, 'useRecordsSelectorContext');
        useRecordsSelectorContext.mockImplementation(() => ({
            records: myRecordsList.data,
        }));
        userIsAdmin.mockImplementation(() => true);

        const { getByTestId, getByText } = setup({ publicationsList: myRecordsList.data });

        fireEvent.click(getByTestId('select-publication-0-input'));
        fireEvent.mouseDown(getByTestId('bulk-updates-actions-select'));
        fireEvent.click(getByText('Change search key value'));

        expect(getByTestId('change-search-key-value-form')).toBeInTheDocument();
    });
});
