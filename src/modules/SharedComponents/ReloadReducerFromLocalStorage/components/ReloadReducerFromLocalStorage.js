import React from 'react';
import Immutable from 'immutable';

const reloadReducerFromLocalStorage = (reducer = 'form') => WrappedComponent => {
    class ReloadReducerFromLocalStorage extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                locallyStoredReducer: null,
            };
        }

        componentWillMount() {
            /* istanbul ignore else */
            if (!!localStorage && localStorage.getItem(reducer) !== null) {
                const locallyStoredReducer = Immutable.Map(JSON.parse(localStorage.getItem(reducer)));

                this.setState({
                    locallyStoredReducer,
                });

                localStorage.removeItem(reducer);
            }
        }

        render() {
            return <WrappedComponent {...this.props} {...this.state} />;
        }
    }

    return ReloadReducerFromLocalStorage;
};

export default reloadReducerFromLocalStorage;
