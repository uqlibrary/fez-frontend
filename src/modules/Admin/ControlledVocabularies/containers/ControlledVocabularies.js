/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import ControlledVocabularies from '../components/ControlledVocabularies';

export const onSubmit = (record, dispatch) => {};

/* istanbul ignore next */
const mapStateToProps = state => {
    // example of how you might use a new controlled vocab reducer and get values from the api/mock data
    // eslint-disable-next-line max-len
    // const { controlledVocabsList, controlledVocabsListLoading, controlledVocabsListError } = state.get('controlledVocabulariesReducer') || {};
    return {
        // for example...
        // controlledVocabsList,
        // controlledVocabsListLoading,
        // controlledVocabsListError
    };
};

const mapDispatchToProps = dispatch => {};

export default connect(mapStateToProps, mapDispatchToProps)(ControlledVocabularies);
