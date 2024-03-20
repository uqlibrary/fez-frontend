import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TopCitedPublications from '../components/TopCitedPublications';
import * as actions from 'actions';

const mapStateToProps = state => {
    return {
        ...state.get('topCitedPublicationsReducer'),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

const TopCitedPublicationsContainer = connect(mapStateToProps, mapDispatchToProps)(TopCitedPublications);

export default TopCitedPublicationsContainer;
