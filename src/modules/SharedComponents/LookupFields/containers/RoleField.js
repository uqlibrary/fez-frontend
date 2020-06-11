import { AutoCompleteSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';
import { connect } from 'react-redux';
import { DATA_COLLECTION_CREATOR_ROLES } from 'config/general';

const mapStateToProps = (state, props) => {
    return {
        autoCompleteSelectFieldId: 'rek-author-role',
        itemsList: DATA_COLLECTION_CREATOR_ROLES,
        allowFreeText: true,
        clearOnSelect: props.clearInput,
        errorText: null,
        error: props.error,
        getOptionLabel: item => (!!item && String(item.value)) || '',
        defaultValue: (!!props.value && { value: props.value }) || null,
        openOnFocus: true,
        // required: props.required,
        disabled: props.disabled,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    loadSuggestions: () => {},
    onChange: item => props.onChange(item.value),
});

export const RoleField = connect(mapStateToProps, mapDispatchToProps)(AutoCompleteSelectField);
