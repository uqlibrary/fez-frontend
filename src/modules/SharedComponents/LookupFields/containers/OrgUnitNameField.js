import {AutoCompleteAsyncField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'org_unit_name';
    return {
        category: category,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
            ? state.get('searchKeysReducer')[category].itemsList : [],
        allowFreeText: true,
        onChange: !!props.input && ((item) => props.input.onChange(item.value)) || props.onChange,
        async: true,
        errorText: !!props.meta && props.meta.error || !!props.errorText && props.errorText || null,
        error: props.meta ? !!props.meta.error : !!props.errorText || null,
        selectedValue: !!props.input && props.input.value || !!props.value && {value: props.value} || '',
        itemToString: (item) => !!item && String(item.value) || ''
    };
};

const mapDispatchToProps = (dispatch, props) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery)),
        onChange: (value) => {
            if (!!props.input) {
                props.input.onChange(value.value);
            } else if (typeof value === 'string') {
                props.onChange({value});
            } else {
                props.onChange(value);
            }
        }
    }
);

export const OrgUnitNameField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsyncField);

