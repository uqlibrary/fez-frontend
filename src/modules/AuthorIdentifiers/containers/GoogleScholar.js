import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, getFormValues, SubmissionError } from 'redux-form/immutable';
import Immutable from 'immutable';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';

import GoogleScholar from '../components/GoogleScholar';
const FORM_NAME = 'GoogleScholar';

const onSubmit = (values, dispatch, props) => {
    return dispatch(actions.updateCurrentAuthor(props.author.aut_id, values.toJS()))
        .then(() => {
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        })
        .catch(error => {
            throw new SubmissionError({ _error: error.message });
        });
};

const mapStateToProps = (state) => (
    {
        ...state.get('accountReducer'),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        initialValues: {
            aut_id: state.get('accountReducer') && state.get('accountReducer').author
                ? state.get('accountReducer').author.aut_id
                : '',
            aut_google_scholar_id: state.get('accountReducer') && state.get('accountReducer').author
                ? state.get('accountReducer').author.aut_google_scholar_id
                : '',
        },
    }
);

const mapDispatchToProps = (dispatch) => (
    {
        actions: bindActionCreators(actions, dispatch),
    }
);

let GoogleScholarContainer = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(GoogleScholar);

GoogleScholarContainer = connect(mapStateToProps, mapDispatchToProps)(GoogleScholarContainer);
GoogleScholarContainer = withRouter(GoogleScholarContainer);

export default GoogleScholarContainer;
