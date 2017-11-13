import {AutoSuggestField} from 'uqlibrary-react-toolbox';
import {connect} from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'series';
    return {
        category: category,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
            ? state.get('searchKeysReducer')[category].itemsList : [],
        allowFreeText: true,
        onChange: props.input.onChange,
        async: true,
        errorText: props.meta ? props.meta.error : null
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery))
    }
);

export const SeriesField = connect(mapStateToProps, mapDispatchToProps)(AutoSuggestField);

