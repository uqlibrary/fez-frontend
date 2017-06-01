import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import GettingStarted from '../components/GettingStarted';
import {closeDialog, nextPage} from '../actions';

let GettingStartedContainer = reduxForm({
    destroyOnUnmount: false
})(GettingStarted);

GettingStartedContainer = connect(null, dispatch => {
    return {
        closeDialog: () => dispatch(closeDialog()),
        nextPage: () => dispatch(nextPage())
    };
})(GettingStartedContainer);

export default GettingStartedContainer;
