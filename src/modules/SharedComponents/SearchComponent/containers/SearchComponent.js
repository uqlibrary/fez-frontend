import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SearchComponent from '../components/SearchComponent';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        searchParams: state && state.get('searchRecordsReducer') && state.get('searchRecordsReducer').searchParams || {}
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let SearchComponentContainer = connect(mapStateToProps, mapDispatchToProps)(SearchComponent);
SearchComponentContainer = withRouter(SearchComponentContainer);
export default SearchComponentContainer;
