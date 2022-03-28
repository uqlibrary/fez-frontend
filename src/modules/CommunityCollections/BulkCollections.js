import { connect } from 'react-redux';
import { reduxForm, getFormValues, getFormSyncErrors } from 'redux-form/immutable';
import Immutable from 'immutable';
import CollectionBulkForm from './components/CollectionsBulkForm';
import { checkSession, clearSessionExpiredFlag } from 'actions';
import { bindActionCreators } from 'redux';

// import queryString from 'query-string';

const FORM_NAME = 'CollectionBulk';

const onSubmit = (values, dispatch, props) => {
    // const queryStringObject = queryString.parse(
    //     location && ((location.hash && location.hash.replace('?', '&').replace('#', '?')) || location.search),
    //     { ignoreQueryPrefix: true },
    // );
    // const currentAuthor = props.author || null;
    // let parentPID = {};

    // if (!!queryStringObject.pid) {
    //     parentPID = {
    //         fez_record_search_key_ismemberof: queryStringObject.pid,
    //     };
    // }
    // return dispatch(
    //     createCollection({ ...values.toJS(), ...parentPID }, (currentAuthor && currentAuthor.aut_id) || null),
    // ).catch(error => {
    //     throw new SubmissionError({ _error: error });
    // });

    alert('This is a submission');
    console.log('THE values', values);
    console.log('THE dispatch', dispatch);
    console.log('THE props values', props);
};

const CollectionContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(CollectionBulkForm);

const mapStateToProps = state => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        collectionsSelected:
            (state && state.get('viewCollectionsReducer') && state.get('viewCollectionsReducer').collectionsSelected) ||
            null,
        // author: (state && state.get('accountReducer') && state.get('accountReducer').author) || null,
        // newRecord:
        //    (state && state.get('createCollectionReducer') && state.get('createCollectionReducer').newRecord) || null,

        //  const collectionsSelected = useSelector(state => state.get('viewCollectionsReducer').collectionsSelected);
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ checkSession, clearSessionExpiredFlag }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionContainer);
