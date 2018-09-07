import {AutoCompleteAsyncField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'author';
    return {
        category: category,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
            ? state.get('searchKeysReducer')[category].itemsList.filter(item => !!item.id && item.id !== 0)
            : [],
        onChange: props.onChange,
        allowFreeText: true,
        async: true,
        selectedValue: !!props.label && {value: props.label} || !!props.value && {value: props.value} || '',
        itemToString: (item) => !!item && String(`${item.id} (${item.value})`) || '',
        maxResults: 50
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery))
    }
);

export const AuthorIdField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);

