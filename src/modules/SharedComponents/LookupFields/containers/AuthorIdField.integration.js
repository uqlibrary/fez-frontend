/* eslint-disable */
import React from 'react';
import { AuthorIdField } from './AuthorIdField';
import Immutable from 'immutable';
import { rtlRender, fireEvent, cleanup, withRedux } from 'test-utils';

describe('AuthorIdField ', () => {
    afterEach(() => cleanup);

    it('should clear input field', async () => {
        const initialState = Immutable.Map({
            searchKeysReducer: {
                author: {
                    itemsList: Immutable.List([]),
                },
            },
        });
        const testFn = jest.fn();
        const { asFragment, getByRole } = rtlRender(
            withRedux(initialState)(
                <AuthorIdField
                    input={{
                        onChange: testFn,
                        value: {
                            id: 123,
                            value: 'test',
                        },
                    }}
                    showClear
                />,
            ),
        );

        let fragment = asFragment();

        expect(fragment).toMatchSnapshot();

        fireEvent.click(getByRole('presentation'));

        expect(fragment).toMatchDiffSnapshot((fragment = asFragment()));
    });
});
