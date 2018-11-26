import {AutoCompleteAsyncField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions/actionTypes';
import {DATA_COLLECTION_CREATOR_ROLES} from 'config/general';

const mapStateToProps = (state, props) => {
    const category = 'role';
    return {
        category: category,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
            ? state.get('searchKeysReducer')[category].itemsList : [],
        allowFreeText: true,
        onChange: (item) => props.onChange(item.value),
        errorText: null,
        error: false,
        itemToString: (item) => !!item && String(item.value) || '',
        selectedValue: !!props.value && {value: props.value} || null,
        openOnFocus: true,
        filter: () => true,
        clearInput: props.clearInput
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey) => dispatch({type: `${actions.SEARCH_KEY_LOOKUP_LOADED}@${searchKey}`, payload: DATA_COLLECTION_CREATOR_ROLES})
    }
);

export const RoleField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);

