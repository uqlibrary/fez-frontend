import { AutoCompleteMultiSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import * as actions from 'actions';

const mapStateToProps = (state, props) => {
    const { itemsList, itemsLoading } = state.get('collectionsReducer') || {};
    return {
        id: props.id,
        itemsList: itemsList || [],
        itemsLoading,
        getOptionLabel: item => item.rek_title,
        ...(!!((props || {}).meta || {}).form
            ? {
                defaultValue: itemsList.filter(collection => props.input.value.includes(collection.rek_pid)),
                error: !!props.meta.error,
                errorText: props.meta.error || '',
            }
            : {
                defaultValue: itemsList.filter(collection => props.value.includes(collection.rek_pid)),
                error: props.error,
                errorText: props.errorText || '',
            }),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: () => dispatch(actions.collectionsList()),
    ...(!!((props || {}).meta || {}).form
        ? {
            onChange: item => props.input.onChange(item.map(collection => collection.rek_pid)),
            onClear: () => props.input.onChange(null),
        }
        : {
            onChange: item => props.onChange(item.map(collection => collection.rek_pid)),
            onClear: () => props.onChange(null),
        }),
});

export const CollectionField = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AutoCompleteMultiSelectField);
