/* eslint-disable */
import React from 'react';
import { CollectionField } from './CollectionField';
import Immutable from 'immutable';
import { rtlRender, fireEvent, cleanup, withRedux } from 'test-utils';

describe('CollectionField ', () => {
    afterEach(() => cleanup);

    it('should add chips for selected items', async () => {
        const initialState = Immutable.Map({
            searchKeysReducer: {
                collection: {
                    itemsList: Immutable.List([]),
                },
            },
        });
        const testFn = jest.fn();
        const { asFragment, getByRole } = rtlRender(
            withRedux(initialState)(
                <CollectionField
                    input={{
                        onChange: testFn,
                        value: Immutable.List([
                            {
                                id: 'UQ:222222',
                                value: 'Testing collection',
                            },
                            {
                                id: 'UQ:111111',
                                value: 'Test collection',
                            },
                        ]),
                    }}
                />,
            ),
        );

        let fragment = asFragment();

        expect(fragment).toMatchSnapshot();

        fireEvent.click(getByRole('presentation'));

        expect(fragment).toMatchDiffSnapshot((fragment = asFragment()));
    });
});
