import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import matchSorter from 'match-sorter';
import { GenericOptionTemplate } from 'modules/SharedComponents/LookupFields';

const mapStateToProps = (state, props) => {
    const getUqUsername = item => {
        if (item.aut_org_username) return ` (${item.aut_org_username})`;
        else if (item.aut_student_username) return ` (${item.aut_student_username})`;
        else if (item.aut_ref_num) return ` (${item.aut_ref_num})`;
        else return '';
    };
    return {
        autoCompleteAsynchronousFieldId: props.uqIdFieldId || 'aut-id',
        itemsList: state.get('authorsReducer')
            ? state
                  .get('authorsReducer')
                  .authorsList.filter(
                      item => !!item.aut_org_username || !!item.aut_student_username || !!item.aut_ref_num,
                  )
                  .map(item => ({
                      value: `${item.aut_title} ${item.aut_display_name}${getUqUsername(item)}`,
                      id: item.aut_id,
                      ...item,
                  }))
            : [],
        itemsLoading: (state.get('authorsReducer') && state.get('authorsReducer').authorsListLoading) || false,
        defaultValue: (!!props.value && { value: props.value }) || '',
        getOptionLabel: option => option.value || '',
        filterOptions: (options, { inputValue }) =>
            matchSorter(options, inputValue, {
                keys: ['aut_id', 'aut_display_name', 'aut_org_username', 'aut_student_username', 'aut_ref_num'],
            }),
        floatingLabelText: props.floatingLabelText || 'UQ Identifier',
        hintText: props.hintText || 'Enter a value to search',
        OptionTemplate: GenericOptionTemplate,
        disabled: props.disabled,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: (searchQuery = '') => dispatch(actions.searchAuthors(searchQuery)),
    clearSuggestions: () => dispatch(actions.clearAuthorsSuggestions()),
    onChange: props.onChange,
    onClear: !!props.value ? props.onClear : () => {},
});

// prettier-ignore
export const UqIdField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsynchronousField);
