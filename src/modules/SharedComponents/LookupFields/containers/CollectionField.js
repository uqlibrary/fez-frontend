import { AutoCompleteMultiSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading } = state.get('collectionsReducer') || {};

    return {
        id: props.id,
        autoCompleteAsynchronousFieldId: 'rek-ismemberof',
        itemsList: itemsList || [],
        itemsLoading,
        getOptionLabel: item => item.rek_title,
        ...(!!((props || {}).meta || {}).form
            ? {
                  defaultValue:
                      (!!props.input.value && !!props.input.value.toJS && props.input.value.toJS()) ||
                      (!!props.input.value && props.input.value) ||
                      [],
                  error: !!props.meta.error,
                  errorText: props.meta.error || '',
              }
            : {
                  defaultValue: itemsList.filter(collection => (props.value || []).includes(collection.rek_pid)),
                  error: props.error,
                  errorText: props.errorText || '',
              }),
        autoCompleteMultiSelectFieldId: props.collectionFieldId,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: () => dispatch(actions.collectionsList()),
    ...(!!((props || {}).meta || {}).form
        ? {
              onChange: item => props.input.onChange(item),
              onClear: () => props.input.onChange(null),
          }
        : {
              onChange: item => props.onChange(item.map(collection => collection.rek_pid)),
              onClear: () => props.onChange(null),
          }),
});

export const CollectionField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteMultiSelectField);
