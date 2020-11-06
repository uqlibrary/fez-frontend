import React from 'react';
import AuthorsList from './AuthorsList';
import { render, fireEvent, WithReduxStore } from 'test-utils';
import locale from 'locale/components';

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
            fireEvent.click(getByTestId('rek-author-save'));

            expect(queryByText('No records to display')).not.toBeInTheDocument();
            expect(getByTestId('rek-author-list-row-0')).toBeInTheDocument();
        });

        it('should render a list and user should be able to edit', () => {
            const { getByTestId } = setup({
                list: [
                    {
                        nameAsPublished: 'test 1',
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
            fireEvent.click(getByTestId('rek-author-save'));

            expect(getByTestId('rek-author-list-row-0-name-as-published')).toHaveTextContent('test');

            fireEvent.click(getByTestId('rek-author-list-row-0-edit'));
            fireEvent.change(getByTestId('rek-author-input'), { target: { value: '' } });
            expect(getByTestId('rek-author-save').closest('button')).toHaveAttribute('disabled');

            fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'testing' } });
            expect(getByTestId('rek-author-save')).not.toHaveAttribute('disabled');
        });
    });
});
