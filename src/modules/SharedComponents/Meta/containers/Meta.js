import {connect} from 'react-redux';
import Meta from '../components/Meta';

const mapStateToProps = (state) => {
    const publication = !!state.get('viewRecordReducer') && state.get('viewRecordReducer').recordToView;
    return {
        publication: publication,
        isTitleOnly: !publication
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Meta);
