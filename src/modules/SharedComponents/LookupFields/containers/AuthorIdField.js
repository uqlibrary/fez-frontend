import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import matchSorter from 'match-sorter';
import { GenericOptionTemplate } from 'modules/SharedComponents/LookupFields';

const mapStateToProps = (state, props) => {
    return {
        id: props.id,
        itemsList:
            state.get('searchKeysReducer') && state.get('searchKeysReducer').author
                ? state.get('searchKeysReducer').author.itemsList.filter(item => !!item.id && item.id !== 0)
                : [],
        getOptionLabel: item => (!!item && String(`${item.id} (${item.value})`)) || '',
        filterOptions: (options, { inputValue }) => matchSorter(options, inputValue, { keys: ['id', 'value'] }),
        OptionTemplate: GenericOptionTemplate,
        ...(!!((props || {}).meta || {}).form // If form key is set in props.meta object then it's a redux-form Field
            ? {
                defaultValue:
                      (!!props.input.value &&
                          (props.input.value.toJS ? props.input.value.toJS() : props.input.value)) ||
                      null,
                error: !!props.meta.error,
                errorText: props.meta.error || '',
            }
            : {
                error: props.error,
                errorText: props.errorText || '',
            }),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadSearchKeyList('author', searchQuery)),
    ...(!!((props || {}).meta || {}).form // If form key is set in props.meta object then it's a redux-form Field
        ? {
            onChange: item => props.input.onChange(item),
            onClear: () => props.input.onChange(null),
        }
        : {
            onChange: item => props.onChange(item),
            onClear: () => props.onChange(null),
        }),
});

export const AuthorIdField = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteAsynchronousField);
