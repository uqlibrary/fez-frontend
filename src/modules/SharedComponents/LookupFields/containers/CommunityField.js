import { AutoCompleteMultiSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading } = state.get('communitiesReducer') || {};

    const hasForm = !!((props || {}).meta || {}).form;
    const defaultValue = hasForm
        ? (!!props.input.value && !!props.input.value.toJS && props.input.value.toJS()) ||
          (!!props.input.value && props.input.value) ||
          []
        : props.value || [];
    // remove existing entries from full list of collections
    const existingCollectionPids = defaultValue.map(collection => collection.rek_pid || collection);
    const missingCollections = itemsList.filter(item => existingCollectionPids.indexOf(item.rek_pid) === -1);

    console.log('CommunityField', itemsList, hasForm, defaultValue, existingCollectionPids, missingCollections);
    return {
        id: props.id,
        autoCompleteAsynchronousFieldId: 'rek-ismemberof',
        itemsList: missingCollections || [],
        itemsLoading,
        getOptionLabel: item => item.rek_title,
        ...(hasForm
            ? {
                  defaultValue,
                  error: !!props.meta.error,
                  errorText: props.meta.error || '',
              }
            : {
                  defaultValue: itemsList.filter(collection => defaultValue.includes(collection.rek_pid)),
                  error: props.error,
                  errorText: props.errorText || '',
              }),
        autoCompleteMultiSelectFieldId: props.collectionFieldId,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: () => dispatch(actions.communitiesList()),
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

export const CommunityField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteMultiSelectField);
