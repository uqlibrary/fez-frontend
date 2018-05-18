import {connect} from 'react-redux';
import {locale} from 'locale';
import MyRecords from '../components/MyRecords';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as actions from 'actions';

const mapStateToProps = (state) => {
    return {
        accountLoading: state.get('accountReducer').accountLoading,
        ...state.get('publicationsReducer'),
        localePages: locale.pages.myResearch
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

let ResearchContainer = connect(mapStateToProps, mapDispatchToProps)(MyRecords);
ResearchContainer = withRouter(ResearchContainer);
export default ResearchContainer;
