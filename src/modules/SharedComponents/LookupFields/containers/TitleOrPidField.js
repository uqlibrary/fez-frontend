import {AutoCompleteAsyncField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'publication';
    return {
        category: category,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
            ? state
                .get('searchKeysReducer')[category].itemsList
                .map(publication => ({id: publication.rek_pid, value: publication.rek_title}))
            : [],
        onChange: (item) => props.input.onChange(item),
        async: true,
        errorText: props.meta ? props.meta.error : null,
        error: !!props.meta && !!props.meta.error,
        itemToString: (item) => !!item && String(item.value) || '',
        selectedValue: props.input ? props.input.value : null,
        maxResults: 20
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadPublicationList(searchKey, searchQuery))
    };
};

export const TitleOrPidField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);

