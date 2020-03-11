import { AutoCompleteAsynchronousField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const category = 'org_name';
    return {
        category: category,
        itemsList:
            state.get('searchKeysReducer') && state.get('searchKeysReducer')[category]
                ? state.get('searchKeysReducer')[category].itemsList
                : [],
        allowFreeText: true,
        getOptionLabel: item => (!!item && String(item.value)) || '',
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
    loadSuggestions: (searchQuery = ' ') => dispatch(actions.loadSearchKeyList('org_name', searchQuery)),
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

export const OrgNameField = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteAsynchronousField);
