import {connect} from 'react-redux';

import {reduxForm} from 'redux-form/immutable';
import PublicationRow from '../components/PublicationRow';
import {loadPublicationSubTypesList, loadAuthorsList} from '../actions';
import Immutable from 'immutable';


let PublicationRowFormContainer = reduxForm({
    form: 'PublicationRow'
})(PublicationRow);

PublicationRowFormContainer = connect(state => {
    const publicationTypeState = state.get('publicationSubTypes');
    return {
        authorList: publicationTypeState.get('authorList') || Immutable.Map({}),
        publicationSubTypeList: publicationTypeState.get('publicationSubTypeList')
    };
}, dispatch => {
    return {
        loadPublicationSubTypesList: () => dispatch(loadPublicationSubTypesList()),
        loadAuthorsList: () => dispatch(loadAuthorsList())
    };
})(PublicationRowFormContainer);

export default PublicationRowFormContainer;
