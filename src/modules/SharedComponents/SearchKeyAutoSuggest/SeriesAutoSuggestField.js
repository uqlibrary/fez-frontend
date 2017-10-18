import React from 'react';
import {locale} from 'config';
import SearchKeyAutoSuggest from './components/SearchKeyAutoSuggest';

export default function SeriesAutoSuggestField(fieldProps) {
    const {series} = locale.components.publicationForm.searchKey;
    return(
        <SearchKeyAutoSuggest
            {...fieldProps}
            searchKey={series.key}
            locale={series.field}
            onChange={fieldProps.input.onChange}
        />
    );
}
