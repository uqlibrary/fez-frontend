import React from 'react';
import ReloadReducerFromLocalStorage from './ReloadReducerFromLocalStorage';
import { LocallyStoredReducerContext } from 'context';
import { rtlRender } from 'test-utils';
import Immutable from 'immutable';

const setup = (testProps = {}) => {
    const props = {
        ...testProps,
    };

    return rtlRender(<ReloadReducerFromLocalStorage {...props} />);
};

describe('ReloadReducerFromLocalStorage component', () => {
    it('should provide context for the component to load default reducer from localstorage', () => {
        window.localStorage.setItem('form', JSON.stringify({ test: 'abc' }));
        setup({
            children: (
                <LocallyStoredReducerContext.Consumer>
                    {({ locallyStoredReducer }) => {
                        expect(locallyStoredReducer).toEqual(Immutable.Map({ test: 'abc' }));
                    }}
                </LocallyStoredReducerContext.Consumer>
            ),
        });
    });

    it('should provide context for the component to load default reducer from localstorage', () => {
        window.localStorage.setItem('record', JSON.stringify({ publication: { pid: 'UQ:123455' } }));
        setup({
            reducer: 'record',
            children: (
                <LocallyStoredReducerContext.Consumer>
                    {({ locallyStoredReducer }) => {
                        expect(locallyStoredReducer).toEqual(Immutable.Map({ publication: { pid: 'UQ:123455' } }));
                    }}
                </LocallyStoredReducerContext.Consumer>
            ),
        });
    });

    it('should not provide context for the component to load default reducer from localstorage', () => {
        window.localStorage.setItem('record', JSON.stringify({ publication: { pid: 'UQ:123455' } }));
        setup({
            reducer: 'form',
            children: (
                <LocallyStoredReducerContext.Consumer>
                    {({ locallyStoredReducer }) => {
                        expect(locallyStoredReducer).toEqual(undefined);
                    }}
                </LocallyStoredReducerContext.Consumer>
            ),
        });
    });
});
