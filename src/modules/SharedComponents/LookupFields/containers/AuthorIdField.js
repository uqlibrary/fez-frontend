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
        onChange: (item) => {
            if (!item.id) {
                !!props.input
                    ? props.input.onChange({...item, id: item.value})
                    : props.onChange({...item, id: item.value});
            } else {
                !!props.input
                    ? props.input.onChange(item)
                    : props.onChange(item);
            }
        },
        allowFreeText: true,
        async: true,
        selectedValue: !props.input && (!!props.label && {value: props.label} || !!props.value && {value: props.value}) || '',
        itemToString: (item) => !!item && String(`${item.id} (${item.value})`) || '',
        maxResults: 50,
        error: (!!props.meta && !!props.meta.error) || props.error,
        errorText: (!!props.meta && !!props.meta.error && props.meta.error) || (props.error && props.errorText) || ''
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery))
    }
);

export const AuthorIdField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);

