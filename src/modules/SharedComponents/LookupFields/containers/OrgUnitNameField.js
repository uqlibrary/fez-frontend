import {AutoSuggestField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
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
        dataSourceConfig: {text: 'value', value: 'value'},
        errorText: !!props.meta && props.meta.error || !!props.errorText && props.errorText || null,
        selectedValue: !!props.input && props.input.value || !!props.value && {value: props.value} || ''
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery))
    }
);

export const OrgUnitNameField = connect(mapStateToProps, mapDispatchToProps)(AutoSuggestField);

