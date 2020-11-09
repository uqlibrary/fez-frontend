import React from 'react';
import AuthorsList from './AuthorsList';
import { act, render, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import locale from 'locale/components';
import * as repositories from 'repositories';

function setup(testProps = {}) {
    const props = {
        contributorEditorId: 'rek-author',
        list: [],
        locale: locale.components.authorsList('author').field,
        isNtro: false,
        showRoleInput: false,
        disabled: false,
        onChange: jest.fn(),
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <AuthorsList {...props} />
        </WithReduxStore>,
    );
}

describe('AuthorsList', () => {
    beforeEach(() => {
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });
    });
    it('should render default list view', () => {
        const { getByTestId, getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
        expect(getByTestId('rek-author-add')).toBeInTheDocument();
    });

    it('should render a list of upto 10 contributors and should not show paging or filtering options', () => {
        const { getByTestId } = setup({
            list: [
                {
                    nameAsPublished: 'test 1',
                },
                {
                    nameAsPublished: 'test 2',
                    uqIdentifier: '1234',
                },
                {
                    nameAsPublished: 'test 3',
                },
                {
                    nameAsPublished: 'test 4',
                },
                {
                    nameAsPublished: 'test 5',
                },
                {
                    nameAsPublished: 'test 6',
                },
                {
                    nameAsPublished: 'test 7',
                },
                {
                    nameAsPublished: 'test 8',
                },
                {
                    nameAsPublished: 'test 9',
                },
                {
                    nameAsPublished: 'test 10',
                },
            ],
        });

        expect(getByTestId('rek-author-list-row-0')).toBeInTheDocument();
        expect(getByTestId('rek-author-list-row-9')).toBeInTheDocument();
    });

    describe('for Non-NTRO work', () => {
        it('should add contributor correctly', () => {
            const { getByTestId, getByText, queryByText } = setup();
            expect(getByText('No records to display')).toBeInTheDocument();

            fireEvent.click(getByTestId('rek-author-add'));
            fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
            fireEvent.click(getByTestId('rek-author-add-save'));

            expect(queryByText('No records to display')).not.toBeInTheDocument();
            expect(getByTestId('rek-author-list-row-0')).toBeInTheDocument();
        });

        it('should render a list and user should be able to edit', async () => {
            mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
                data: [
                    {
                        id: 111,
                        value: 'Testing',
                        aut_id: 111,
                        aut_org_username: 'uqtest',
                        aut_fname: 'UQ',
                        aut_lname: 'Test',
                    },
                ],
            });
            const { getByTestId, getByText } = setup({
                list: [
                    {
                        nameAsPublished: 'test 1',
                        uqIdentifier: '0',
                    },
                    {
                        nameAsPublished: 'test 2',
                        uqIdentifier: '1234',
                    },
                ],
            });

            expect(getByTestId('rek-author-list-row-0')).toBeInTheDocument();

            fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
            fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
            fireEvent.click(getByTestId('rek-author-update-save'));

            expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

            fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
            fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
            expect(getByTestId('rek-author-update-save').closest('button')).toHaveAttribute('disabled');

            act(() => {
                fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
            });
            await waitFor(() => getByTestId('rek-author-id-options'));
            fireEvent.click(getByText('Testing'));

            fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
            expect(getByTestId('rek-author-update-save')).not.toHaveAttribute('disabled');
            expect(getByTestId('rek-author-list-row-0-uq-identifiers')).toHaveTextContent('UQ Test - 1234');
        });

        it('should display role column and input field while editing', () => {
            const { getByTestId, getByText } = setup({
                showRoleInput: true,
                list: [
                    {
                        nameAsPublished: 'test 1',
                    },
                    {
                        nameAsPublished: 'test 2',
                        uqIdentifier: '1234',
                        aut_id: 1234,
                    },
                ],
            });

            fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
            fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
            fireEvent.mouseDown(getByTestId('rek-author-role-input'));
            fireEvent.click(getByText('Technician'));
            fireEvent.click(getByTestId('rek-author-update-save'));

            expect(getByTestId('rek-author-list-row-0-role')).toHaveTextContent('Technician');
        });

        it('should display uqUsername and uqIdentifier correctly while editing', () => {
            const { getByTestId, getByText } = setup({
                showRoleInput: true,
                list: [
                    {
                        nameAsPublished: 'test 1',
                        uqIdentifier: '1234',
                        uqUsername: 'uqtest',
                    },
                    {
                        nameAsPublished: 'test 2',
                        uqIdentifier: '1234',
                        aut_id: 1234,
                    },
                ],
            });

            fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
            expect(getByTestId('rek-author-id-input')).toHaveAttribute('value', 'uqtest - 1234');
            fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
            fireEvent.mouseDown(getByTestId('rek-author-role-input'));
            fireEvent.click(getByText('Technician'));
            fireEvent.click(getByTestId('rek-author-update-save'));

            expect(getByTestId('rek-author-list-row-0-role')).toHaveTextContent('Technician');
        });

        it('should delete row correctly', () => {
            const { getByTestId } = setup({
                showRoleInput: true,
                list: [
                    {
                        nameAsPublished: 'test 1',
                    },
                    {
                        nameAsPublished: 'test 2',
                        uqIdentifier: '1234',
                        aut_id: 1234,
                    },
                ],
            });
            fireEvent.click(getByTestId('rek-author-list-row-0-delete'));
            fireEvent.click(getByTestId('rek-author-delete-save'));
        });
    });
});
