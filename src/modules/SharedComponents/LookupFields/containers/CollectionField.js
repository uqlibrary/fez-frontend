import { AutoCompleteAsyncField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'collection';
    console.log(props.input.value);
    return {
        category: category,
        itemsList:
			state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
			    ? state.get('searchKeysReducer')[category].itemsList.map((collection) => ({
			        id: collection.rek_pid,
			        value: collection.rek_title,
				  }))
			    : [],
        onChange: (item) => {
            const items = (!!props.input.value.toJS && props.input.value.toJS()) || props.input.value;
            console.log(items);
            props.input.onChange([...items, item]);
        },
        async: true,
        errorText: props.meta ? props.meta.error : null,
        error: !!props.meta && !!props.meta.error,
        itemToString: (item) => (!!item && String(item.value)) || '',
        selectedValue: null,
        selectedItem: (!!props.input.value.toJS && props.input.value.toJS()) || props.input.value || [],
        maxResults: 20,
        showChips: true,
        multiple: true,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadSuggestions: (searchKey, searchQuery = ' ') =>
            dispatch(actions.loadCollectionsList(searchKey, searchQuery)),
    };
};

export const CollectionField = connect(
    mapStateToProps,
    mapDispatchToProps
)(AutoCompleteAsyncField);
