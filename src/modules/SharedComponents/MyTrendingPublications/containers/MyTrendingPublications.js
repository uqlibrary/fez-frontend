import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyTrendingPublications from '../components/MyTrendingPublications';
import * as actions from 'actions';

const mapStateToProps = state => {
    return {
        ...state.get('myTrendingPublicationsReducer'),
        accountAuthorDetailsLoading: state.get('accountReducer').accountAuthorDetailsLoading,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const MyTrendingPublicationsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(MyTrendingPublications);

export default MyTrendingPublicationsContainer;
