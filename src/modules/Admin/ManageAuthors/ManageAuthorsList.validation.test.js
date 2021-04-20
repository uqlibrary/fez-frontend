import React from 'react';
import ManageAuthorsList from './ManageAuthorsList';
import { render, fireEvent, act, waitFor, WithReduxStore, waitForElementToBeRemoved } from 'test-utils';
import * as repository from 'repositories';

function setup(testProps = {}) {
    const props = {
        onRowAdd: jest.fn(data => Promise.resolve(data)),
        onRowUpdate: jest.fn(data => Promise.resolve(data)),
        onRowDelete: jest.fn(() => Promise.resolve()),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <ManageAuthorsList {...props} />
        </WithReduxStore>,
    );
}

describe('ManageAuthorsList', () => {
    beforeEach(() => {
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });

        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

        jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    });

    it('should validate org username input for existing org username', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 111,
                        aut_org_username: 'uqtest',
                    },
                ],
                total: 1,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            });
        const { getByTestId, getByText } = setup();

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        act(() => {
            fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtest' } });
        });

        await waitFor(() => getByText('The supplied Organisation Username is already on file for another author.'));

        expect(getByTestId('aut-org-username-input')).toHaveAttribute('aria-invalid', 'true');

        act(() => {
            fireEvent.change(getByTestId('aut-org-username-input'), { target: { value: 'uqtesta' } });
        });

        await waitForElementToBeRemoved(() =>
            getByText('The supplied Organisation Username is already on file for another author.'),
        );

        expect(getByTestId('aut-org-username-input')).toHaveAttribute('aria-invalid', 'false');
    });

    it('should validate student username input for existing student username', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 111,
                        aut_student_username: 's1234567',
                    },
                ],
                total: 1,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            });
        const { getByTestId, getByText } = setup();

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        act(() => {
            fireEvent.change(getByTestId('aut-student-username-input'), { target: { value: 's1234567' } });
        });

        await waitFor(() => getByText('The supplied Student username is already on file for another author.'));

        expect(getByTestId('aut-student-username-input')).toHaveAttribute('aria-invalid', 'true');

        act(() => {
            fireEvent.change(getByTestId('aut-student-username-input'), { target: { value: 's1234569' } });
        });

        await waitForElementToBeRemoved(() =>
            getByText('The supplied Student username is already on file for another author.'),
        );

        expect(getByTestId('aut-student-username-input')).toHaveAttribute('aria-invalid', 'false');
    });

    it('should validate org staff id input for existing org staff id and display error message', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 111,
                        aut_org_staff_id: '1234567',
                    },
                ],
                total: 1,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            });
        const { getByTestId, getByText } = setup();

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        act(() => {
            fireEvent.change(getByTestId('aut-org-staff-id-input'), { target: { value: '1234567' } });
        });

        await waitFor(() => getByText('The supplied Organisation Staff ID is already on file for another author.'));

        expect(getByTestId('aut-org-staff-id-input')).toHaveAttribute('aria-invalid', 'true');

        act(() => {
            fireEvent.change(getByTestId('aut-org-staff-id-input'), { target: { value: '1234569' } });
        });

        await waitForElementToBeRemoved(() =>
            getByText('The supplied Organisation Staff ID is already on file for another author.'),
        );

        expect(getByTestId('aut-org-staff-id-input')).toHaveAttribute('aria-invalid', 'false');
    });

    it('should validate org student id input for existing org student id and display error message', async () => {
        mockApi
            .onGet(new RegExp(repository.routes.MANAGE_AUTHORS_LIST_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, {
                data: [
                    {
                        aut_id: 111,
                        aut_org_student_id: '12345678',
                    },
                ],
                total: 1,
            })
            .onGet(new RegExp(repository.routes.AUTHORS_SEARCH_API({}).apiUrl))
            .replyOnce(200, {
                data: [],
                total: 0,
            });
        const { getByTestId, getByText } = setup();

        fireEvent.click(getByTestId('authors-add-new-author'));

        expect(getByTestId('aut-fname-input')).toHaveAttribute('aria-invalid', 'true');
        expect(getByTestId('aut-lname-input')).toHaveAttribute('aria-invalid', 'true');

        expect(getByTestId('authors-add-this-author-save').closest('button')).toHaveAttribute('disabled');

        fireEvent.change(getByTestId('aut-fname-input'), { target: { value: 'Test' } });
        fireEvent.change(getByTestId('aut-lname-input'), { target: { value: 'Name' } });
        act(() => {
            fireEvent.change(getByTestId('aut-org-student-id-input'), { target: { value: '12345678' } });
        });

        await waitFor(() => getByText('The supplied Organisation Student ID is already on file for another author.'));

        expect(getByTestId('aut-org-student-id-input')).toHaveAttribute('aria-invalid', 'true');

        act(() => {
            fireEvent.change(getByTestId('aut-org-student-id-input'), { target: { value: '12345679' } });
        });

        await waitForElementToBeRemoved(() =>
            getByText('The supplied Organisation Student ID is already on file for another author.'),
        );

        expect(getByTestId('aut-org-student-id-input')).toHaveAttribute('aria-invalid', 'false');
    });
});
