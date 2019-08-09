import { AutoCompleteAsyncField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'report_number';
    return {
        category: category,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
            ? state.get('searchKeysReducer')[category].itemsList : [],
        allowFreeText: true,
        onChange: (item) => props.input.onChange(item.value),
        async: true,
        errorText: props.meta ? props.meta.error : null,
        selectedValue: !!props.input && !!props.input.value && { value: props.input.value } || null,
        error: !!props.meta && !!props.meta.error,
        itemToString: (item) => !!item && String(item.value) || '',
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery)),
    }
);

export const ReportNumberField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);

