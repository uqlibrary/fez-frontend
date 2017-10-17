import React from 'react';
import {locale} from 'config';
import SearchKeyAutoComplete from '../../SearchKeyAutoComplete/components/SearchKeyAutoComplete';

export default function SeriesSearchKeyAutoCompleteField(fieldProps) {
    const {series} = locale.components.publicationForm.searchKey;
    return(
        <SearchKeyAutoComplete
            {...fieldProps}
            searchKey={series.key}
            locale={series.field}
            onChange={fieldProps.input.onChange}
        />
    );
}
