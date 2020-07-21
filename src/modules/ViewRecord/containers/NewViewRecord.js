import { connect } from 'react-redux';
import NewViewRecord from '../components/NewViewRecord';

const mapStateToProps = state => ({
    ...state.get('viewRecordReducer'),
    ...state.get('accountReducer'),
});

export default connect(mapStateToProps)(NewViewRecord);
