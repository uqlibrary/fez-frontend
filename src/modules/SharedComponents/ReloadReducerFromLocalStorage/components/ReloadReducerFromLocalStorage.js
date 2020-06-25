import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { LocallyStoredReducerContext } from 'context';

export const ReloadReducerFromLocalStorage = ({ reducer = 'form', children }) => {
    let locallyStoredReducer;
    if (!!localStorage && localStorage.getItem(reducer) !== null) {
        locallyStoredReducer = Immutable.Map(JSON.parse(localStorage.getItem(reducer)));
        localStorage.removeItem(reducer);
    }

    return (
        <LocallyStoredReducerContext.Provider value={{ locallyStoredReducer }}>
            {children}
        </LocallyStoredReducerContext.Provider>
    );
};

ReloadReducerFromLocalStorage.propTypes = {
    reducer: PropTypes.string,
    children: PropTypes.node,
};

export default ReloadReducerFromLocalStorage;
