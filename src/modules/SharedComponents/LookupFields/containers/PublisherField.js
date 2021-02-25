import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const category = 'publisher';
const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading } = (state.get('searchKeysReducer') &&
        state.get('searchKeysReducer')[category]) || { itemsList: [], itemsLoading: false };
    return {
        ...(!!props.name ? { name: props.name } : {}),
        autoCompleteAsynchronousFieldId: props.publisherFieldId || 'rek-publisher',
        category: category,
        placeholder: props.placeholder || null,
        itemsList,
        itemsLoading,
        allowFreeText: true,
        getOptionLabel: item => (!!item && String(item.value)) || '',
        filterOptions: options => options,
        ...(!!((props || {}).meta || {}).form // If form key is set in props.meta object then it's a redux-form Field
            ? {
                  defaultValue: (!!props.input.value && { value: props.input.value }) || null,
                  error: !!props.meta.error,
                  errorText: props.meta.error || '',
              }
            : {
                  defaultValue: (!!props.value && { value: props.value }) || '',
                  error: props.error,
                  errorText: props.errorText || '',
              }),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadSearchKeyList(category, searchQuery)),
    ...(!!((props || {}).meta || {}).form // If form key is set in props.meta object then it's a redux-form Field
        ? {
              onChange: item => props.input.onChange(item.value),
              onClear: () => props.input.onChange(null),
          }
        : {
              onChange: item => props.onChange(item),
              onClear: () => props.onChange({ value: null }),
          }),
});

export const PublisherField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteAsynchronousField);
