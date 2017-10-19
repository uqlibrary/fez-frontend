import {connect} from 'react-redux';
import AutoSuggestField from '../components/AutoSuggestField';

const mapStateToProps = (state) => {
    return {
        ...state.get('orgUnitsReducer')
    };
};

export default connect(mapStateToProps)(AutoSuggestField);
