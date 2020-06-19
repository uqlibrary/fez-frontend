import { connect } from 'react-redux';
import DashboardArticleCount from '../components/DashboardArticleCount';

const mapStateToProps = state => {
    const publicationTotalCount =
        (!!state.get('academicStatsReducer') &&
            !!state.get('academicStatsReducer').publicationTotalCount &&
            state.get('academicStatsReducer').publicationTotalCount) ||
        {};

    return {
        ...publicationTotalCount,
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardArticleCount);
