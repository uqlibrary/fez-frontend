import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import matchSorter from 'match-sorter';

const mapStateToProps = (state, props) => {
    const category = 'journal_name';
    return {
        itemsList:
            state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
                ? state.get('searchKeysReducer')[category].itemsList
                : [],
        allowFreeText: true,
        errorText: props.meta ? props.meta.error : null,
        error: props.meta ? !!props.meta.error : null,
        getOptionLabel: item => (!!item && String(item.value)) || '',
        filterOptions: (options, { inputValue }) => matchSorter(options, inputValue, { keys: ['value'] }),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadSearchKeyList('journal_name', searchQuery)),
    onChange: item => props.input.onChange(item.value),
    onClear: () => props.input.onChange(null),
});

export const JournalNameField = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteAsynchronousField);
