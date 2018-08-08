import {AutoSuggestField} from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import {connect} from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'publisher';
    return {
        category: category,
        itemsList: state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
            ? state.get('searchKeysReducer')[category].itemsList : [],
        allowFreeText: true,
        async: true,
        dataSourceConfig: {text: 'value', value: 'value'},
        errorText: props.errorText,
        selectedValue: !!props.value && {value: props.value} || ''
    };
};

const mapDispatchToProps = (dispatch, props) => (
    {
        loadSuggestions: (searchKey, searchQuery = ' ') => dispatch(actions.loadSearchKeyList(searchKey, searchQuery)),
        onChange: (value) => {
            if (typeof value === 'string') {
                props.onChange({value});
            } else {
                props.onChange(value);
            }
        }
    }
);

export const PublisherField = connect(mapStateToProps, mapDispatchToProps)(AutoSuggestField);

