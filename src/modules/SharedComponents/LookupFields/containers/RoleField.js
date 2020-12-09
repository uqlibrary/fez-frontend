import { AutoCompleteSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import { DATA_COLLECTION_CREATOR_ROLES } from 'config/general';

const mapStateToProps = (state, props) => {
    return {
        autoCompleteSelectFieldId: !!props.autoCompleteSelectFieldId
            ? props.autoCompleteSelectFieldId
            : 'rek-author-role',
        itemsList: !!props.itemsList ? props.itemsList : DATA_COLLECTION_CREATOR_ROLES,
        allowFreeText: props.allowFreeText || false,
        clearOnSelect: props.clearInput,
        errorText: null,
        error: props.error,
        getOptionLabel: item => (!!item && String(item.text)) || '',
        defaultValue: (!!props.value && props.value) || null,
        openOnFocus: true,
        // required: props.required,
        disabled: props.disabled,
        clearable: props.clearable || false,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: () => {},
    onChange: item => props.onChange(item.value),
    onClear: !!props.value ? props.onClear : () => {},
});

export const RoleField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteSelectField);
