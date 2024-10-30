import { connect } from 'react-redux';
import CollectionForm from '../components/CollectionForm';
import { checkSession, clearSessionExpiredFlag } from 'actions';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
    return {
        author: (state && state.get('accountReducer') && state.get('accountReducer').author) || null,
        newRecord:
            (state && state.get('createCollectionReducer') && state.get('createCollectionReducer').newRecord) || null,
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ checkSession, clearSessionExpiredFlag }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionForm);
