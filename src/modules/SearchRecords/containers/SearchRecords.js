import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SearchRecords from '../components/SearchRecords';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        ...state.get('searchRecordsReducer'),
        ...state.get('exportPublicationsReducer'),
        canUseExport: !!state.get('accountReducer').account.canMasquerade || !!state.get('accountReducer').author,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let SearchRecordsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchRecords);
SearchRecordsContainer = withRouter(SearchRecordsContainer);

export default SearchRecordsContainer;
