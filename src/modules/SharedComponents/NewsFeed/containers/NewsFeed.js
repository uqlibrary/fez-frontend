import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewsFeed from '../components/NewsFeed';
import * as actions from 'actions';

const mapStateToProps = state => {
    return {
        ...state.get('newsFeedReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const NewsFeedContainer = connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
export default NewsFeedContainer;
