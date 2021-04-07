import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';
import Fuse from 'fuse.js';
import { GenericOptionTemplate } from 'modules/SharedComponents/LookupFields';

const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading } = (state.get('searchKeysReducer') && state.get('searchKeysReducer').author) || {
        itemsList: [],
        itemsLoading: false,
    };
    const fuseOptions = {
        useExtendedSearch: true,
        ignoreLocation: false,
        ignoreFieldNorm: false,
        keys: ['id', 'value', 'aut_orcid_id'],
    };
    return {
        ...(!!props.name ? { name: props.name } : {}),
        id: props.id,
        autoCompleteAsynchronousFieldId: props.authorIdFieldId,
        itemsList: itemsList.filter(item => !!item.id && item.id !== 0),
        itemsLoading,
        hideLabel: props.hideLabel || false,
        placeholder: props.placeholder || null,
        getOptionLabel: item => (!!item && !!item.id && String(`${item.id} (${item.value})`)) || '',
        filterOptions: (options, { inputValue }) => {
            const fuseAutocompleteOptions = new Fuse(options, fuseOptions);
            return fuseAutocompleteOptions.search(inputValue).map(item => item.item);
        },
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
                  defaultValue: props.value || null,
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

export const AuthorIdField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsynchronousField);
