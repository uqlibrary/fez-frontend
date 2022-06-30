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

    // remove existing entries from full list of communities
    const existingCommunityPids = defaultValue.map(community => community.rek_pid || community);
    const missingCommunity = itemsList.filter(item => existingCommunityPids.indexOf(item.rek_pid) === -1);

    return {
        id: props.id,
        autoCompleteAsynchronousFieldId: 'rek-ismemberof',
        itemsList: missingCommunity || [],
        itemsLoading,
        getOptionLabel: item => item.rek_title,
        ...(hasForm
            ? {
                  defaultValue,
                  error: !!props.meta.error,
                  errorText: props.meta.error || '',
              }
            : {
                  defaultValue: itemsList.filter(community => defaultValue.includes(community.rek_pid)),
                  error: props.error,
                  errorText: props.errorText || '',
              }),
        autoCompleteMultiSelectFieldId: props.communityFieldId,
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
              onChange: item => props.onChange(item.map(community => community.rek_pid)),
              onClear: () => props.onChange(null),
          }),
});

export const CommunityField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteMultiSelectField);
