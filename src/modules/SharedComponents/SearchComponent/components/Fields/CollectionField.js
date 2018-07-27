import {AdvancedSearchMultiSelectField} from '../AdvancedSearchMultiSelectField';
import {connect} from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'collection';
    return {
        value: props.value,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category] ? state.get('searchKeysReducer')[category].itemsList : [
            {'value': 'Test 1'},
            {'value': 'Test 2'},
            {'value': 'Test 3'},
            {'value': 'Test 4'},
            {'value': 'Test 5'},
            {'value': 'Test 6'},
            {'value': 'Test 7'},
        ],
        onChange: (value) => {
            props.onChange({}, value);
        },
        errorText: props.errorText,
        multiple: true
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery))
    }
);

export const CollectionField = connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchMultiSelectField);

