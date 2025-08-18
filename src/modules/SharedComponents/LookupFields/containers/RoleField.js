/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { AutoCompleteSelectField } from 'modules/SharedComponents/Toolbox/AutoSuggestField';

import { DATA_COLLECTION_CREATOR_ROLES } from 'config/general';

export const RoleField = props => {
    return (
        <AutoCompleteSelectField
            {...props}
            autoCompleteSelectFieldId={
                !!props.autoCompleteSelectFieldId ? props.autoCompleteSelectFieldId : 'rek-author-role'
            }
            itemsList={!!props.itemsList ? props.itemsList : DATA_COLLECTION_CREATOR_ROLES}
            allowFreeText={props.allowFreeText || false}
            clearOnSelect={props.clearInput}
            errorText={null}
            error={props.error}
            getOptionLabel={item => (!!item && String(item.text)) || ''}
            defaultValue={(!!props.value && props.value) || null}
            openOnFocus
            disabled={props.disabled}
            clearable={props.clearable || false}
            onChange={item => props.onChange(item.value)}
            onClear={!!props.value ? props.onClear : () => {}}
        />
    );
};

RoleField.propTypes = {
    props: PropTypes.object,
};
export default React.memo(RoleField);
