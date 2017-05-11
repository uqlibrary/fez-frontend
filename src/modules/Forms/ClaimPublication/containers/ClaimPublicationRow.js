import {connect} from 'react-redux';
import {reduxForm} from 'redux-form/immutable';
import ClaimPublicationRow from '../components/ClaimPublicationRow';
import {clearSelectedPublication, loadSelectedPublication} from '../actions';
import {withRouter} from 'react-router';

let ClaimPublicationRowFormContainer = reduxForm({
    destroyOnUnmount: false
})(ClaimPublicationRow);

// withRouter essentially makes the props of the Root.js component available and allows this grandchild component to access the props
ClaimPublicationRowFormContainer = withRouter(connect(null, dispatch => {
    return {
        clearSelectedPublication: () => dispatch(clearSelectedPublication()),
        loadSelectedPublication: (id) => dispatch(loadSelectedPublication(id))
    };
})(ClaimPublicationRowFormContainer));

export default ClaimPublicationRowFormContainer;
