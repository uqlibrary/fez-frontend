import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import matchSorter from 'match-sorter';

const category = 'journal_name';
const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading } = (state.get('searchKeysReducer') &&
        state.get('searchKeysReducer')[category]) || { itemsList: [], itemsLoading: false };
    return {
        autoCompleteAsynchronousFieldId: props.newspaperNameFieldId || 'rek-newspaper-name',
        itemsList,
        itemsLoading,
        allowFreeText: true,
        errorText: props.meta ? props.meta.error : null,
        error: props.meta ? !!props.meta.error : null,
        getOptionLabel: item => (!!item && String(item.value)) || '',
        filterOptions: (options, { inputValue }) => matchSorter(options, inputValue, { keys: ['value'] }),
        floatingLabelText: props.floatingLabelText || 'Newspaper name',
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadSearchKeyList(category, searchQuery)),
    onChange: item => props.input.onChange(item.value),
    onClear: () => props.input.onChange(null),
});

export const NewspaperNameField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsynchronousField);
