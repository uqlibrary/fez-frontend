import React from 'react';

import { BULK_UPDATES_SEARCH_KEY_COMPONENTS } from 'config/bulkUpdates';

export const SearchKeyValueField = fieldProps => {
    const { component: SearchKeyValueComponent, componentProps } = BULK_UPDATES_SEARCH_KEY_COMPONENTS[
        fieldProps.searchKey
    ];
    return <SearchKeyValueComponent onChange={fieldProps.input.onChange} {...componentProps} {...fieldProps} />;
};
